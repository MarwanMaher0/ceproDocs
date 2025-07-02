# API Integration

## 🌐 HTTP Client Configuration

Cepro.ai uses Axios as the primary HTTP client for API communication, with a sophisticated configuration including interceptors, token management, and error handling.

## 🔧 Axios Instance Setup

### Base Configuration (`/src/services/axiosInstance.ts`)

```typescript
import axios from 'axios';
import { useAppStore } from '@/stores/index';

// API Base URL from environment variables
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string;

// Create Axios instance with base configuration
const axiosIns = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Environment Configuration
```bash
# .env.development
VITE_API_BASE_URL=https://dev-api.cepro.ai/api/v1

# .env.production
VITE_API_BASE_URL=https://api.cepro.ai/api/v1

# .env.staging
VITE_API_BASE_URL=https://staging-api.cepro.ai/api/v1
```

---

## 🔐 Authentication & Token Management

### Token Utilities
```typescript
// Token management functions
const getAccessToken = (): string | null => 
  localStorage.getItem('access_token');

const getRefreshToken = (): string | null => 
  localStorage.getItem('refresh_token');

const saveAccessToken = (token: string): void => 
  localStorage.setItem('access_token', token);

const saveRefreshToken = (token: string): void => 
  localStorage.setItem('refresh_token', token);

const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
```

### JWT Token Handling
```typescript
// Decode JWT token to check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

// Get token with automatic refresh
const getValidToken = async (): Promise<string | null> => {
  const accessToken = getAccessToken();
  
  if (!accessToken || isTokenExpired(accessToken)) {
    return await refreshAccessToken();
  }
  
  return accessToken;
};
```

---

## 🔄 Request & Response Interceptors

### Request Interceptor
```typescript
axiosIns.interceptors.request.use(
  async (config) => {
    const store = useAppStore();
    
    // Show loading indicator
    store.toggleSubLoader(true);
    
    // Add authentication token
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    const store = useAppStore();
    store.toggleSubLoader(false);
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);
```

### Response Interceptor with Auto-Refresh
```typescript
axiosIns.interceptors.response.use(
  (response) => {
    const store = useAppStore();
    store.toggleSubLoader(false);
    
    // Log response time for performance monitoring
    const duration = Date.now() - response.config.metadata?.startTime;
    console.log(`API Response: ${response.config.url} (${duration}ms)`);
    
    return response;
  },
  async (error) => {
    const store = useAppStore();
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    
    store.toggleSubLoader(false);
    
    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosIns(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    handleApiError(error);
    return Promise.reject(error);
  }
);
```

### Token Refresh Implementation
```typescript
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
      refresh: refreshToken,
    });
    
    const { access, refresh } = response.data;
    
    saveAccessToken(access);
    if (refresh) {
      saveRefreshToken(refresh);
    }
    
    return access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    throw error;
  }
};
```

---

## 🛠️ API Service Patterns

### Generic API Service
```typescript
// Base API service class
class ApiService {
  protected endpoint: string;
  
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  
  async getAll(params?: Record<string, any>) {
    const response = await axiosIns.get(this.endpoint, { params });
    return response.data;
  }
  
  async getById(id: string) {
    const response = await axiosIns.get(`${this.endpoint}/${id}/`);
    return response.data;
  }
  
  async create(data: any) {
    const response = await axiosIns.post(`${this.endpoint}/`, data);
    return response.data;
  }
  
  async update(id: string, data: any) {
    const response = await axiosIns.put(`${this.endpoint}/${id}/`, data);
    return response.data;
  }
  
  async delete(id: string) {
    const response = await axiosIns.delete(`${this.endpoint}/${id}/`);
    return response.data;
  }
}
```

### Feature-Specific Services

#### Client Management Service
```typescript
// /src/views/Clients/services/clientsApi.ts
class ClientsService extends ApiService {
  constructor() {
    super('/clients');
  }
  
  async listClients(params: {
    page?: number;
    page_size?: number;
    search?: string;
    business_field?: string;
  } = {}) {
    return this.getAll(params);
  }
  
  async createClient(clientData: {
    client_contact_name: string;
    contact_email: string;
    business_field: number[];
    brand_details: {
      name: string;
      description: string;
      logo?: File;
    };
  }) {
    const formData = new FormData();
    
    // Handle file uploads
    if (clientData.brand_details.logo) {
      formData.append('logo', clientData.brand_details.logo);
    }
    
    // Handle nested objects
    formData.append('client_data', JSON.stringify(clientData));
    
    const response = await axiosIns.post('/clients/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
}

export const clientsService = new ClientsService();

// Legacy function exports for backward compatibility
export const listClients = (params?: any) => clientsService.listClients(params);
export const deleteClient = (id: string) => clientsService.delete(id);
```

#### Incident Management Service
```typescript
// /src/views/services/incidentsApi.ts
interface IncidentParams {
  page_number?: number;
  page_size?: number;
  incident_type?: string;
  status?: string;
  client_uuid?: string;
  date_from?: string;
  date_to?: string;
}

export const indexincidents = async (
  page_number: number = 1,
  page_size: number = 10,
  incident_type: string = '',
  client_uuid: string = '',
  admin_uuid: string = ''
) => {
  const params = {
    page_number,
    page_size,
    ...(incident_type && { incident_type }),
    ...(client_uuid && { client_uuid }),
    ...(admin_uuid && { admin_uuid }),
  };
  
  const response = await axiosIns.get('/incidents/', { params });
  return response.data;
};

export const createIncident = async (incidentData: any) => {
  const response = await axiosIns.post('/incidents/', incidentData);
  return response.data;
};

export const deleteincident = async (uuid: string) => {
  const response = await axiosIns.delete(`/incidents/${uuid}/`);
  return response.data;
};
```

---

## 📊 Dashboard API Integration

### Dashboard Data Service
```typescript
// Dashboard API endpoints
export const dashboardService = {
  async getSummary() {
    const response = await axiosIns.get('/dashboard/summary/');
    return response.data;
  },
  
  async getIncidentsVsTakedowns() {
    const response = await axiosIns.get('/stats/incidents-vs-takedowns/');
    return response.data;
  },
  
  async getTakedownDurations() {
    const response = await axiosIns.get('/stats/takedown-durations/');
    return response.data;
  },
  
  async getTopCountries() {
    const response = await axiosIns.get('/stats/top-countries/');
    return response.data;
  },
  
  async getTopClients() {
    const response = await axiosIns.get('/stats/top-clients/');
    return response.data;
  },
  
  async getRecentTakedowns() {
    const response = await axiosIns.get('/stats/recent-takedowns/');
    return response.data;
  },
};
```

### Usage in Components
```typescript
// Dashboard component API integration
const initializeDashboard = async () => {
  try {
    const [
      summaryData,
      incidentsData,
      durationsData,
      countriesData,
      clientsData,
      takedownsData,
    ] = await Promise.all([
      dashboardService.getSummary(),
      dashboardService.getIncidentsVsTakedowns(),
      dashboardService.getTakedownDurations(),
      dashboardService.getTopCountries(),
      dashboardService.getTopClients(),
      dashboardService.getRecentTakedowns(),
    ]);
    
    // Process and assign data to reactive variables
    panels.value = processSummaryData(summaryData);
    chartData.value = processIncidentsData(incidentsData);
    // ... additional data processing
    
  } catch (error) {
    console.error('Dashboard initialization failed:', error);
    // Handle error state
  }
};
```

---

## 🔄 File Upload Handling

### File Upload Service
```typescript
class FileUploadService {
  async uploadFile(file: File, endpoint: string, additionalData?: any) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }
    
    const response = await axiosIns.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${progress}%`);
      },
    });
    
    return response.data;
  }
  
  async uploadMultipleFiles(files: File[], endpoint: string) {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    const response = await axiosIns.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
}

export const fileUploadService = new FileUploadService();
```

### Image Upload with Preview
```typescript
// Image upload utility
export const handleImageUpload = (
  file: File,
  callback: (preview: string) => void
) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const preview = e.target?.result as string;
    callback(preview);
  };
  
  reader.readAsDataURL(file);
};

// Usage in components
const uploadLogo = async (file: File) => {
  try {
    // Generate preview
    handleImageUpload(file, (preview) => {
      logoPreview.value = preview;
    });
    
    // Upload file
    const result = await fileUploadService.uploadFile(file, '/upload/logo/');
    logoUrl.value = result.url;
    
  } catch (error) {
    console.error('Logo upload failed:', error);
    // Handle error
  }
};
```

---

## ⚠️ Error Handling

### Global Error Handler
```typescript
const handleApiError = (error: any) => {
  const { response } = error;
  
  if (!response) {
    // Network error
    showErrorNotification('Network error. Please check your connection.');
    return;
  }
  
  switch (response.status) {
    case 400:
      // Bad request - show validation errors
      handleValidationErrors(response.data);
      break;
      
    case 401:
      // Unauthorized - handled by interceptor
      break;
      
    case 403:
      // Forbidden
      showErrorNotification('You do not have permission to perform this action.');
      break;
      
    case 404:
      // Not found
      showErrorNotification('The requested resource was not found.');
      break;
      
    case 422:
      // Validation error
      handleValidationErrors(response.data);
      break;
      
    case 500:
      // Server error
      showErrorNotification('Server error. Please try again later.');
      break;
      
    default:
      showErrorNotification('An unexpected error occurred.');
  }
};

const handleValidationErrors = (errorData: any) => {
  if (errorData.errors) {
    Object.keys(errorData.errors).forEach(field => {
      const messages = errorData.errors[field];
      messages.forEach((message: string) => {
        showFieldError(field, message);
      });
    });
  }
};
```

### Component-Level Error Handling
```typescript
// In Vue components
const handleApiCall = async (apiFunction: Function, ...args: any[]) => {
  try {
    isLoading.value = true;
    const result = await apiFunction(...args);
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    // Component-specific error handling
    if (error.response?.status === 404) {
      router.push('/error404');
    }
  } finally {
    isLoading.value = false;
  }
};
```

---

## 📝 Request/Response Logging

### Development Logging
```typescript
if (import.meta.env.DEV) {
  // Request logging
  axiosIns.interceptors.request.use((config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });
    return config;
  });
  
  // Response logging
  axiosIns.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}
```

---

## 🚀 Performance Optimization

### Request Caching
```typescript
class CachedApiService {
  private cache = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  async cachedGet(url: string, params?: any) {
    const cacheKey = `${url}?${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const response = await axiosIns.get(url, { params });
    
    this.cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });
    
    return response.data;
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

### Request Debouncing
```typescript
// Debounced search function
import { debounce } from 'lodash-es';

const debouncedSearch = debounce(async (query: string) => {
  try {
    const response = await axiosIns.get('/search/', {
      params: { q: query },
    });
    searchResults.value = response.data;
  } catch (error) {
    console.error('Search failed:', error);
  }
}, 300);
```

---

## 🧪 API Testing

### Mock API for Development
```typescript
// Mock API service for development
if (import.meta.env.VITE_USE_MOCK_API === 'true') {
  import('./mocks/handlers').then(({ handlers }) => {
    const { setupWorker } = require('msw');
    const worker = setupWorker(...handlers);
    worker.start();
  });
}
```

### API Testing Utilities
```typescript
// Test utilities for API mocking
export const createMockResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

export const mockApiCall = (response: any, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(response), delay);
  });
};
```

---

*This API integration documentation provides comprehensive guidance for working with APIs in Cepro.ai. For specific endpoint documentation, refer to the backend API documentation and individual service files.*
