# State Management

## 🏪 Pinia Store Architecture

Cepro.ai uses Pinia for state management, providing a modern, type-safe, and intuitive approach to managing global application state. The store architecture is organized around specific domains and responsibilities.

## 📚 Store Overview

### Store Structure
```
src/stores/
├── index.ts                # Main application store
├── useMyDataStore.ts       # User data and profile information
├── usePermissionsStore.ts  # User permissions and access control
├── useThemeStore.ts        # Theme configuration and customization
└── businessFields.ts       # Business fields reference data
```

---

## 🏛️ Main Application Store (`index.ts`)

### Purpose
Central store managing core application state including theme, layout, internationalization, and UI state.

### State Properties
```typescript
interface AppState {
  // Theme and UI
  isDarkMode: boolean;
  isArabic: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Layout configuration
  mainLayout: 'app' | 'auth';
  menu: 'vertical' | 'horizontal' | 'collapsible-vertical';
  layout: 'full' | 'boxed-layout';
  navbar: 'navbar-sticky' | 'navbar-floating' | 'navbar-static';
  
  // Internationalization
  rtlClass: 'rtl' | 'ltr';
  locale: string;
  languageList: Array<{ code: string; name: string }>;
  
  // UI State
  sidebar: boolean;
  animation: string;
  semidark: boolean;
  isShowMainLoader: boolean;
  isShowSubLoader: boolean;
}
```

### Key Actions

#### Theme Management
```typescript
// Toggle between light, dark, and system themes
toggleTheme(payload: 'light' | 'dark' | 'system') {
  this.theme = payload;
  localStorage.setItem('theme', payload);
  
  if (payload === 'light') {
    this.isDarkMode = false;
  } else if (payload === 'dark') {
    this.isDarkMode = true;
  } else if (payload === 'system') {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  // Apply theme to DOM
  document.querySelector('body')?.classList.toggle('dark', this.isDarkMode);
}
```

#### Layout Configuration
```typescript
// Switch between menu layouts
toggleMenu(payload: 'vertical' | 'horizontal' | 'collapsible-vertical') {
  this.sidebar = false; // Reset sidebar state
  localStorage.setItem('menu', payload);
  this.menu = payload;
}

// Toggle layout style
toggleLayout(payload: 'full' | 'boxed-layout') {
  localStorage.setItem('layout', payload);
  this.layout = payload;
}
```

#### Internationalization
```typescript
// Switch application language
toggleLocale(payload: string) {
  i18n.global.locale.value = payload;
  localStorage.setItem('i18n_locale', payload);
  this.locale = payload;
  this.isArabic = payload.toLowerCase() === 'ae';
  
  // Automatically switch to RTL for Arabic
  if (this.isArabic) {
    this.toggleRTL('rtl');
  } else {
    this.toggleRTL('ltr');
  }
}
```

#### Loading States
```typescript
// Main application loader
toggleMainLoader(state: boolean) {
  this.isShowMainLoader = state;
}

// Sub-component loaders
toggleSubLoader(state: boolean) {
  this.isShowSubLoader = state;
}
```

### Usage Example
```typescript
// In components
const store = useAppStore();

// Toggle theme
store.toggleTheme('dark');

// Switch language
store.toggleLocale('ae');

// Show/hide sidebar
store.toggleSidebar(true);
```

---

## 👤 User Data Store (`useMyDataStore.ts`)

### Purpose
Manages user profile information, authentication state, and user-specific data.

### State Structure
```typescript
interface MyDataState {
  myData: [string, string, string, string]; // [name, email, role, icon_logo_url]
}
```

### Key Features
- User profile information storage
- Authentication state management
- Role-based data access
- Profile image handling

### Actions
```typescript
// Set user data from API response
setMyData(data: [string, string, string, string]) {
  this.myData = data;
}

// Get specific user information
getName(): string {
  return this.myData[0] || '';
}

getEmail(): string {
  return this.myData[1] || '';
}

getRole(): string {
  return this.myData[2] || '';
}

getIconUrl(): string {
  return this.myData[3] || '';
}
```

### Usage in Components
```typescript
const myDataStore = useMyDataStore();

// Reactive user data
const myData = computed(() => ({
  name: myDataStore.myData[0] || '',
  email: myDataStore.myData[1] || '',
  role: myDataStore.myData[2] || '',
  icon_logo_url: myDataStore.myData[3] || '',
}));

// Watch for changes
watch(
  () => myDataStore.myData,
  (newMyData) => {
    // React to user data changes
    console.log('User data updated:', newMyData);
  },
  { immediate: true }
);
```

---

## 🔐 Permissions Store (`usePermissionsStore.ts`)

### Purpose
Manages user permissions and access control throughout the application.

### State Structure
```typescript
interface PermissionsState {
  permissions: string[];
  roles: string[];
  userRole: string;
}
```

### Permission Checking
```typescript
// Check if user has specific permission
hasPermission(permission: string): boolean {
  return this.permissions.includes(permission);
}

// Check multiple permissions
hasAnyPermission(permissions: string[]): boolean {
  return permissions.some(permission => this.hasPermission(permission));
}

// Check if user has specific role
hasRole(role: string): boolean {
  return this.userRole === role || this.roles.includes(role);
}
```

### Role-based Access Control
```typescript
// Admin roles
const isAdmin = computed(() => 
  permissionsStore.hasRole('Cepro Admin') || 
  permissionsStore.hasRole('Super Admin')
);

// Distributor access
const isDistributor = computed(() => 
  permissionsStore.hasRole('Distributor Admin')
);

// Client access
const isClient = computed(() => 
  permissionsStore.hasRole('Client Admin')
);
```

---

## 🎨 Theme Store (`useThemeStore.ts`)

### Purpose
Manages application theming, branding, and visual customization.

### State Structure
```typescript
interface ThemeState {
  theme: {
    dark_logo: string;
    light_logo: string;
    icon_logo: string;
    primemary: {
      light: string;
      dark: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
  };
}
```

### Theme Management
```typescript
// Update theme configuration
updateTheme(newTheme: ThemeConfig) {
  this.theme = { ...this.theme, ...newTheme };
}

// Get logo based on current theme
getCurrentLogo(): string {
  const appStore = useAppStore();
  return appStore.isDarkMode ? this.theme.light_logo : this.theme.dark_logo;
}

// Apply color scheme to DOM
applyColorScheme() {
  document.documentElement.style.setProperty(
    '--primary-default', 
    this.theme.primemary.light
  );
  document.documentElement.style.setProperty(
    '--primary-light', 
    this.theme.primemary.dark
  );
}
```

### Usage in Components
```typescript
const themeStore = useThemeStore();

// Reactive theme data
const theme = computed(() => themeStore.theme);

// Watch for theme changes
watch(
  () => themeStore.theme,
  (newTheme) => {
    // Apply theme changes
    applyThemeToComponents(newTheme);
  },
  { immediate: true }
);
```

---

## 📊 Business Fields Store (`businessFields.ts`)

### Purpose
Manages reference data for business fields and industry categories.

### State Structure
```typescript
interface BusinessFieldsState {
  fields: Array<{
    id: number;
    name: string;
    code: string;
    description?: string;
  }>;
  loading: boolean;
  error: string | null;
}
```

### Data Management
```typescript
// Fetch business fields from API
async fetchBusinessFields() {
  this.loading = true;
  try {
    const response = await axios.get('/business-fields/');
    this.fields = response.data;
  } catch (error) {
    this.error = error.message;
  } finally {
    this.loading = false;
  }
}

// Get field by ID
getFieldById(id: number) {
  return this.fields.find(field => field.id === id);
}

// Filter fields by category
getFieldsByCategory(category: string) {
  return this.fields.filter(field => field.code.startsWith(category));
}
```

---

## 🔄 Store Composition Patterns

### Cross-Store Communication
```typescript
// Using multiple stores together
const appStore = useAppStore();
const myDataStore = useMyDataStore();
const permissionsStore = usePermissionsStore();

// Combined computed properties
const userContext = computed(() => ({
  user: myDataStore.myData,
  permissions: permissionsStore.permissions,
  theme: appStore.theme,
  isAdmin: permissionsStore.hasRole('Cepro Admin'),
}));
```

### Store Initialization
```typescript
// Initialize stores on app mount
onMounted(async () => {
  await myDataStore.fetchUserData();
  await permissionsStore.fetchPermissions();
  await businessFieldsStore.fetchBusinessFields();
  
  // Apply initial theme
  themeStore.applyColorScheme();
});
```

### Persistent State
```typescript
// State persistence with localStorage
watch(
  () => appStore.theme,
  (newTheme) => {
    localStorage.setItem('app-theme', JSON.stringify(newTheme));
  },
  { deep: true }
);

// Restore state on initialization
const savedTheme = localStorage.getItem('app-theme');
if (savedTheme) {
  appStore.toggleTheme(JSON.parse(savedTheme));
}
```

---

## 🔧 Store Utilities and Helpers

### Store Factory Pattern
```typescript
// Create consistent store structure
function createEntityStore<T>(entityName: string) {
  return defineStore(`${entityName}Store`, {
    state: () => ({
      items: [] as T[],
      loading: false,
      error: null as string | null,
    }),
    
    actions: {
      async fetchItems() {
        this.loading = true;
        try {
          const response = await axios.get(`/${entityName}/`);
          this.items = response.data;
        } catch (error) {
          this.error = error.message;
        } finally {
          this.loading = false;
        }
      },
    },
  });
}
```

### Store Composition Helpers
```typescript
// Helper for reactive store data
export function useStoreData<T>(
  store: any, 
  dataKey: string
): ComputedRef<T> {
  return computed(() => store[dataKey]);
}

// Helper for store actions
export function useStoreActions(store: any, actions: string[]) {
  return actions.reduce((acc, action) => {
    acc[action] = (...args: any[]) => store[action](...args);
    return acc;
  }, {} as Record<string, Function>);
}
```

---

## 🧪 Testing Stores

### Unit Testing Setup
```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from '@/stores/index';

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should toggle theme correctly', () => {
    const store = useAppStore();
    store.toggleTheme('dark');
    expect(store.isDarkMode).toBe(true);
    expect(store.theme).toBe('dark');
  });
});
```

### Integration Testing
```typescript
// Test store integration with components
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

const wrapper = mount(Component, {
  global: {
    plugins: [createTestingPinia()],
  },
});
```

---

## 🚀 Performance Optimization

### Store Optimization Tips
1. **Selective Reactivity**: Use `markRaw()` for non-reactive data
2. **Computed Properties**: Leverage computed properties for derived state
3. **Lazy Loading**: Load store data only when needed
4. **State Normalization**: Normalize complex nested state
5. **Memory Management**: Clean up subscriptions and watchers

### Example Optimized Store
```typescript
export const useOptimizedStore = defineStore('optimized', {
  state: () => ({
    // Mark large objects as non-reactive
    staticData: markRaw({}),
    // Use Maps for better performance with large datasets
    entityCache: new Map(),
  }),
  
  getters: {
    // Memoized expensive computations
    expensiveComputation: (state) => {
      // Use computed caching
      return computed(() => {
        return state.items.reduce((acc, item) => {
          // Complex computation
          return acc + item.value;
        }, 0);
      });
    },
  },
});
```

---

*This state management documentation provides a comprehensive guide to using Pinia stores in Cepro.ai. For specific implementation examples, refer to the component documentation and API integration guides.*
