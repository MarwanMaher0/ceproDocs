# Best Practices

## 🏗️ Code Organization

### File and Folder Structure

#### Naming Conventions
```
Components:         PascalCase     (UserProfile.vue, DataTable.vue)
Views/Pages:        PascalCase     (Dashboard.vue, ClientDetails.vue)
Composables:        camelCase      (useUserData.ts, useApiCall.ts)
Utilities:          camelCase      (dateHelpers.ts, validators.ts)
Constants:          SCREAMING_SNAKE_CASE (API_ENDPOINTS.ts)
Variables:          camelCase      (userData, isLoading)
Types/Interfaces:   PascalCase     (UserData, ApiResponse)
```

#### Directory Organization
```
src/
├── components/           # Reusable components
│   ├── base/            # Basic components (Button, Input)
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── feature/         # Feature-specific components
├── views/               # Page components
│   ├── Dashboard/       # Feature-based grouping
│   ├── Users/          
│   └── Settings/       
├── composables/         # Reusable composition functions
├── utils/               # Pure utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── services/            # API and external services
```

### Component Organization

#### Single File Component Structure
```vue
<template>
  <!-- Template with clear, semantic HTML -->
  <div class="user-profile">
    <header class="user-profile__header">
      <h1>{{ user.name }}</h1>
    </header>
    
    <main class="user-profile__content">
      <!-- Component content -->
    </main>
  </div>
</template>

<script setup lang="ts">
// 1. Imports (grouped by type)
import type { User } from '@/types/user';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

// 2. Props and emits
interface Props {
  userId: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

const emit = defineEmits<{
  userUpdated: [user: User];
  error: [message: string];
}>();

// 3. Reactive data
const user = ref<User | null>(null);
const isLoading = ref(false);

// 4. Computed properties
const displayName = computed(() => {
  return user.value ? `${user.value.firstName} ${user.value.lastName}` : '';
});

// 5. Methods
const fetchUser = async () => {
  isLoading.value = true;
  try {
    // Fetch user logic
  } catch (error) {
    emit('error', 'Failed to fetch user');
  } finally {
    isLoading.value = false;
  }
};

// 6. Lifecycle hooks
onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
/* Component-specific styles */
.user-profile {
  @apply bg-white rounded-lg shadow-sm p-6;
}

.user-profile__header {
  @apply border-b border-gray-200 pb-4 mb-6;
}

.user-profile__content {
  @apply space-y-4;
}
</style>
```

---

## 🎯 Component Design Patterns

### Composition API Best Practices

#### Composable Functions
```typescript
// composables/useUserData.ts
import { ref, computed } from 'vue';
import type { User } from '@/types/user';
import { userService } from '@/services/userService';

export function useUserData() {
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const activeUsers = computed(() => 
    users.value.filter(user => user.status === 'active')
  );

  const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      users.value = await userService.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      const newUser = await userService.create(userData);
      users.value.push(newUser);
      return newUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add user';
      throw err;
    }
  };

  return {
    // State
    users: readonly(users),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computed
    activeUsers,
    
    // Methods
    fetchUsers,
    addUser,
  };
}
```

#### Props and Emits Patterns
```typescript
// Strong typing for props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
});

// Typed emits
const emit = defineEmits<{
  click: [event: MouseEvent];
  focus: [event: FocusEvent];
  submit: [data: FormData];
}>();

// Usage
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
```

### Component Communication Patterns

#### Parent-Child Communication
```vue
<!-- Parent Component -->
<template>
  <UserForm
    :user="selectedUser"
    @user-updated="handleUserUpdate"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
const handleUserUpdate = (user: User) => {
  // Handle user update
  users.value = users.value.map(u => 
    u.id === user.id ? user : u
  );
};

const handleCancel = () => {
  selectedUser.value = null;
};
</script>
```

#### Provide/Inject for Deep Hierarchies
```typescript
// Provider (ancestor component)
import { provide } from 'vue';
import type { InjectionKey } from 'vue';

interface ThemeContext {
  theme: Ref<'light' | 'dark'>;
  toggleTheme: () => void;
}

const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme');

// In setup()
provide(ThemeKey, {
  theme,
  toggleTheme,
});

// Consumer (descendant component)
import { inject } from 'vue';

const themeContext = inject(ThemeKey);
if (!themeContext) {
  throw new Error('Theme context not found');
}
```

---

## 🏪 State Management Best Practices

### Pinia Store Patterns

#### Store Structure
```typescript
// stores/userStore.ts
import { defineStore } from 'pinia';
import type { User } from '@/types/user';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    activeUsers: (state) => 
      state.users.filter(user => user.status === 'active'),
    
    getUserById: (state) => (id: string) =>
      state.users.find(user => user.id === id),
    
    userCount: (state) => state.users.length,
  },

  actions: {
    async fetchUsers() {
      this.isLoading = true;
      this.error = null;
      
      try {
        this.users = await userService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createUser(userData: Omit<User, 'id'>) {
      try {
        const newUser = await userService.create(userData);
        this.users.push(newUser);
        return newUser;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create user';
        throw error;
      }
    },

    setCurrentUser(user: User | null) {
      this.currentUser = user;
    },

    clearError() {
      this.error = null;
    },
  },
});
```

#### Store Composition
```typescript
// Composable for store usage
export function useUsers() {
  const store = useUserStore();
  
  const refresh = () => store.fetchUsers();
  
  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      await store.createUser(userData);
      // Additional logic like showing success message
      showSuccessMessage('User created successfully');
    } catch (error) {
      showErrorMessage('Failed to create user');
    }
  };

  return {
    // State
    users: computed(() => store.users),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    
    // Actions
    refresh,
    createUser,
  };
}
```

---

## 🔗 API Integration Patterns

### Service Layer Pattern
```typescript
// services/userService.ts
import { api } from '@/services/api';
import type { User, CreateUserRequest, UpdateUserRequest } from '@/types/user';

export class UserService {
  private endpoint = '/users';

  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<User[]> {
    const response = await api.get<User[]>(this.endpoint, { params });
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>(this.endpoint, userData);
    return response.data;
  }

  async update(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`${this.endpoint}/${id}`, userData);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export const userService = new UserService();
```

### Repository Pattern
```typescript
// repositories/userRepository.ts
import type { User } from '@/types/user';
import { userService } from '@/services/userService';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

class ApiUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    return userService.getAll();
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await userService.getById(id);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async save(user: User): Promise<User> {
    if (user.id) {
      return userService.update(user.id, user);
    } else {
      return userService.create(user);
    }
  }

  async delete(id: string): Promise<void> {
    return userService.delete(id);
  }
}

export const userRepository: UserRepository = new ApiUserRepository();
```

---

## 🎨 Styling Best Practices

### TailwindCSS Patterns

#### Component Variants
```vue
<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
});

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
  ].join(' ');
});
</script>
```

#### Responsive Design Patterns
```css
/* Mobile-first approach */
.responsive-grid {
  @apply grid grid-cols-1 gap-4;
  
  /* Tablet */
  @apply md:grid-cols-2 md:gap-6;
  
  /* Desktop */
  @apply lg:grid-cols-3 lg:gap-8;
  
  /* Large desktop */
  @apply xl:grid-cols-4;
}

/* Container patterns */
.container-fluid {
  @apply w-full px-4 sm:px-6 lg:px-8;
}

.container-fixed {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

---

## 🔧 TypeScript Best Practices

### Type Definitions
```typescript
// types/user.ts
export interface User {
  readonly id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'distributor' | 'client';
export type UserStatus = 'active' | 'inactive' | 'pending';

export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserRequest = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Generic Utilities
```typescript
// types/utils.ts
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Form handling
export interface FormField<T = string> {
  value: T;
  error: string | null;
  touched: boolean;
  valid: boolean;
}

export type FormData<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// API states
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

---

## 🧪 Testing Best Practices

### Component Testing
```typescript
// tests/components/UserCard.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import UserCard from '@/components/UserCard.vue';
import type { User } from '@/types/user';

const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'admin',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserCard', () => {
  it('renders user information correctly', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    });

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('john@example.com');
  });

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    });

    await wrapper.find('[data-test="edit-button"]').trigger('click');
    
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockUser]);
  });

  it('shows loading state', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser, loading: true },
    });

    expect(wrapper.find('[data-test="loading"]').exists()).toBe(true);
  });
});
```

### Store Testing
```typescript
// tests/stores/userStore.test.ts
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserStore } from '@/stores/userStore';
import { userService } from '@/services/userService';

vi.mock('@/services/userService');

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetches users successfully', async () => {
    const mockUsers = [mockUser];
    vi.mocked(userService.getAll).mockResolvedValue(mockUsers);

    const store = useUserStore();
    await store.fetchUsers();

    expect(store.users).toEqual(mockUsers);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(null);
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Network error';
    vi.mocked(userService.getAll).mockRejectedValue(new Error(errorMessage));

    const store = useUserStore();
    await expect(store.fetchUsers()).rejects.toThrow(errorMessage);

    expect(store.error).toBe(errorMessage);
    expect(store.isLoading).toBe(false);
  });
});
```

---

## 🔒 Security Best Practices

### Input Validation
```typescript
// utils/validation.ts
export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  password: (value: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
};

// XSS Prevention
export const sanitizeHtml = (html: string): string => {
  // Use a library like DOMPurify for production
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### Permission Checking
```typescript
// composables/usePermissions.ts
export function usePermissions() {
  const permissionsStore = usePermissionsStore();

  const hasPermission = (permission: string): boolean => {
    return permissionsStore.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasRole = (role: string): boolean => {
    return permissionsStore.userRole === role;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
  };
}

// Usage in components
const { hasPermission } = usePermissions();

const canEditUser = computed(() => hasPermission('user:edit'));
```

---

## 📊 Performance Best Practices

### Lazy Loading
```typescript
// Router lazy loading
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/users',
    component: () => import('@/views/Users/UsersIndex.vue'),
  },
];

// Component lazy loading
const AsyncComponent = defineAsyncComponent({
  loader: () => import('@/components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000,
});
```

### Memoization
```typescript
// Computed memoization
const expensiveComputation = computed(() => {
  // Expensive calculation
  return data.value.reduce((acc, item) => {
    return acc + complexCalculation(item);
  }, 0);
});

// Function memoization
import { memoize } from 'lodash-es';

const memoizedFormatter = memoize((value: number, locale: string) => {
  return new Intl.NumberFormat(locale).format(value);
});
```

### Virtual Scrolling
```vue
<template>
  <VirtualList
    :data="largeDataSet"
    :item-height="50"
    :visible-count="10"
  >
    <template #item="{ item }">
      <UserCard :user="item" />
    </template>
  </VirtualList>
</template>
```

---

## 📝 Documentation Best Practices

### Component Documentation
```vue
<template>
  <!-- UserCard displays user information with actions -->
  <div class="user-card">
    <!-- Component implementation -->
  </div>
</template>

<script setup lang="ts">
/**
 * UserCard Component
 * 
 * Displays user information in a card format with optional actions.
 * Supports loading states and different display modes.
 * 
 * @example
 * <UserCard 
 *   :user="userData" 
 *   :loading="isLoading"
 *   @edit="handleEdit"
 *   @delete="handleDelete" 
 * />
 */

interface Props {
  /** User data to display */
  user: User;
  /** Show loading state */
  loading?: boolean;
  /** Enable edit action */
  editable?: boolean;
  /** Enable delete action */
  deletable?: boolean;
}

interface Emits {
  /** Emitted when user clicks edit button */
  edit: [user: User];
  /** Emitted when user clicks delete button */
  delete: [user: User];
}
</script>
```

### API Documentation
```typescript
/**
 * User Service
 * 
 * Handles all user-related API operations including CRUD operations
 * and user management functionality.
 */
export class UserService {
  /**
   * Retrieves all users with optional filtering
   * 
   * @param params - Query parameters for filtering
   * @param params.page - Page number for pagination
   * @param params.limit - Number of items per page
   * @param params.search - Search term for filtering
   * @returns Promise resolving to array of users
   * 
   * @example
   * const users = await userService.getAll({ page: 1, limit: 10 });
   */
  async getAll(params?: GetUsersParams): Promise<User[]> {
    // Implementation
  }
}
```

---

*These best practices provide a comprehensive guide for maintaining high code quality, consistency, and maintainability in the Cepro.ai frontend application. Following these patterns will ensure scalable and robust development.*
