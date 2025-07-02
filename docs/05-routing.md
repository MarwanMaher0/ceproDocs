# Routing & Navigation

## 🛣️ Vue Router Configuration

Cepro.ai uses Vue Router 4 for client-side routing, providing a sophisticated navigation system with role-based access control, lazy loading, and meta information for enhanced user experience.

## 📁 Router Structure

### Router Configuration (`/src/router/index.ts`)

The router is organized around feature modules with consistent naming conventions and lazy loading for optimal performance.

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/index';
import appSetting from '@/app-setting';

const routes: RouteRecordRaw[] = [
  // Core routes configuration
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});
```

---

## 🏠 Route Organization

### Dashboard Routes
```typescript
// Main dashboard
{ 
  path: '/', 
  name: 'home', 
  component: () => import('../views/index.vue') 
},
```

### Feature Module Routes

#### Website Module
```typescript
{
  path: '/website',
  component: () => import('@/views/website/index.vue'),
  meta: { name: 'website', type: 'website' },
},
{
  path: '/website/add-new-incident',
  component: () => import('@/views/website/AddNewIncident/index.vue'),
  meta: { name: 'website_add_new_incident', type: 'website' },
},
{
  path: '/website/incident-details/:id',
  component: () => import('@/views/website/IncidentDetails/[id].vue'),
  meta: { name: 'website_incident_details', type: 'website' },
},
{
  path: '/website/edit-incident/:id',
  component: () => import('@/views/website/EditIncident/[id].vue'),
  meta: { name: 'website_edit_incident', type: 'website' },
},
```

#### Social Media Module
```typescript
{
  path: '/socialMedia',
  component: () => import('@/views/socialMedia/index.vue'),
  meta: { name: 'social_media', type: 'social_media' },
},
{
  path: '/socialMedia/add-new-incident',
  component: () => import('@/views/socialMedia/AddNewIncident/index.vue'),
  meta: { name: 'social_media_add_new_incident', type: 'social_media' },
},
// ... additional social media routes
```

#### Applications Module
```typescript
{
  path: '/applications',
  component: () => import('@/views/applications/index.vue'),
  meta: { name: 'applications', type: 'applications' },
},
{
  path: '/applications/add-new-incident',
  component: () => import('@/views/applications/AddNewIncident/index.vue'),
  meta: { name: 'applications_add_new_incident', type: 'applications' },
},
// ... additional application routes
```

### Administration Routes

#### Account Management
```typescript
{
  path: '/accounts',
  component: () => import('@/views/accounts/index.vue'),
  meta: { name: 'accounts' },
},
{
  path: '/accounts/add-admin',
  component: () => import('@/views/accounts/AddNewAdmin/index.vue'),
  meta: { name: 'accounts_add_new_admin' },
},
{
  path: '/accounts/edit-admin/:id',
  component: () => import('@/views/accounts/EditAdmin/[id].vue'),
  meta: { name: 'accounts_edit_admin' },
},
```

#### Client Management
```typescript
{
  path: '/clients',
  component: () => import('@/views/Clients/index.vue'),
  meta: { name: 'clients' },
},
{
  path: '/clients/add',
  component: () => import('@/views/Clients/add/index.vue'),
  meta: { name: 'clients_add_new_client' },
},
{
  path: '/clients/edit/:id',
  component: () => import('@/views/Clients/edit/[id].vue'),
  meta: { name: 'clients_edit_client' },
},
{
  path: '/clients/details/:id',
  component: () => import('@/views/Clients/details/[id].vue'),
  meta: { name: 'clients_client_details' },
},
```

#### Distributor Management
```typescript
{
  path: '/distributor',
  component: () => import('@/views/Distributor/index.vue'),
  meta: { name: 'distributor' },
},
{
  path: '/distributor/add',
  component: () => import('@/views/Distributor/add/index.vue'),
  meta: { name: 'distributors_add_new_distributor' },
},
{
  path: '/distributor/details/:id',
  component: () => import('@/views/Distributor/details/[id].vue'),
  meta: { name: 'distributors_distributor_details' },
},
```

### Utility Pages
```typescript
// Error pages
{
  path: '/pages/error404',
  name: 'error404',
  component: () => import('@/views/pages/error404.vue'),
  meta: { layout: 'auth' },
},
{
  path: '/pages/error500',
  name: 'error500',
  component: () => import('@/views/pages/error500.vue'),
  meta: { layout: 'auth' },
},

// Knowledge base
{
  path: '/pages/knowledge-base',
  name: 'knowledge-base',
  component: () => import('@/views/pages/knowledge-base.vue'),
},
```

---

## 🔧 Route Meta Information

### Meta Properties
```typescript
interface RouteMeta {
  name?: string;           // Display name for breadcrumbs
  type?: string;           // Module type for context-aware features
  layout?: 'app' | 'auth'; // Layout to use for the route
  permissions?: string[];   // Required permissions
  roles?: string[];        // Required user roles
  requiresAuth?: boolean;  // Authentication requirement
}
```

### Usage Examples
```typescript
// Route with full meta information
{
  path: '/clients/add',
  component: () => import('@/views/Clients/add/index.vue'),
  meta: {
    name: 'clients_add_new_client',
    type: 'client_management',
    requiresAuth: true,
    permissions: ['create_client'],
    roles: ['Cepro Admin', 'Distributor Admin'],
  },
},
```

---

## 🔒 Navigation Guards

### Global Before Guards
```typescript
router.beforeEach(async (to, from, next) => {
  const store = useAppStore();
  
  // Initialize app settings
  appSetting.init();
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return next('/login');
  }
  
  // Check permissions
  if (to.meta.permissions && !hasRequiredPermissions(to.meta.permissions)) {
    return next('/unauthorized');
  }
  
  // Set layout based on route
  if (to.meta.layout) {
    store.setMainLayout(to.meta.layout);
  }
  
  next();
});
```

### Route-Specific Guards
```typescript
// In component
beforeRouteEnter(to, from, next) {
  // Validate route parameters
  if (!to.params.id || !isValidId(to.params.id)) {
    next('/error404');
  } else {
    next();
  }
},

beforeRouteUpdate(to, from, next) {
  // Handle route parameter changes
  this.loadData(to.params.id);
  next();
},
```

---

## 🧭 Navigation Patterns

### Programmatic Navigation

#### Basic Navigation
```typescript
// Using router instance
const router = useRouter();

// Navigate to route
router.push('/clients');
router.push({ name: 'clients' });
router.push({ path: '/clients/add' });

// Navigate with parameters
router.push(`/clients/details/${clientId}`);
router.push({ 
  name: 'client-details', 
  params: { id: clientId } 
});

// Navigate with query parameters
router.push({ 
  path: '/clients', 
  query: { page: 1, size: 10 } 
});
```

#### Navigation in Components
```typescript
// Incident management navigation
function handleViewIncident(row: IncidentData) {
  const type = row.type || 'website';
  router.push(`/${type}/incident-details/${row.uuid}`);
}

function handleEditIncident(row: IncidentData) {
  const type = row.type || 'website';
  router.push(`/${type}/edit-incident/${row.uuid}`);
}

// Client management navigation
function handleViewClient(row: ClientData) {
  router.push(`/clients/details/${row.uuid}`);
}

function handleEditClient(row: ClientData) {
  router.push(`/clients/edit/${row.uuid}`);
}
```

### Declarative Navigation
```vue
<!-- Router links with dynamic paths -->
<router-link :to="`/clients/details/${client.uuid}`">
  View Client
</router-link>

<!-- Named routes -->
<router-link :to="{ name: 'client-details', params: { id: client.uuid } }">
  View Details
</router-link>

<!-- Conditional navigation -->
<router-link 
  v-if="hasPermission('view_client')"
  :to="`/clients/details/${client.uuid}`"
>
  View Client
</router-link>
```

---

## 🍞 Breadcrumb System

### Breadcrumb Implementation
```vue
<!-- Header.vue breadcrumb -->
<ul class="flex space-x-2 rtl:space-x-reverse">
  <li>
    <router-link to="/" class="text-primary hover:underline">
      {{ $t('dashboard') }}
    </router-link>
  </li>
  <li v-if="route.meta.name" class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
    {{ $t(route.meta.name) }}
  </li>
</ul>
```

### Dynamic Breadcrumbs
```typescript
// Generate breadcrumbs based on route
const breadcrumbs = computed(() => {
  const route = useRoute();
  const crumbs = [];
  
  // Always include dashboard
  crumbs.push({ name: 'Dashboard', path: '/' });
  
  // Add parent sections
  if (route.path.includes('/clients')) {
    crumbs.push({ name: 'Clients', path: '/clients' });
  }
  
  // Add current page
  if (route.meta.name) {
    crumbs.push({ 
      name: route.meta.name, 
      path: route.path,
      active: true 
    });
  }
  
  return crumbs;
});
```

---

## 🔄 Route Transitions

### Page Transitions
```vue
<!-- App.vue with transitions -->
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
```

### CSS Transitions
```css
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition */
.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

---

## 📱 Mobile Navigation

### Responsive Navigation
```typescript
// Mobile menu handling
const store = useAppStore();

const toggleMobileMenu = () => {
  if (window.innerWidth < 1024) {
    store.toggleSidebar();
  }
};

// Close mobile menu on route change
router.afterEach(() => {
  if (window.innerWidth < 1024) {
    store.toggleSidebar(false);
  }
});
```

### Touch-Friendly Navigation
```vue
<!-- Mobile-optimized navigation -->
<nav class="mobile-nav lg:hidden">
  <router-link 
    v-for="item in mobileMenuItems"
    :key="item.path"
    :to="item.path"
    class="block px-4 py-3 text-sm font-medium"
    @click="closeMobileMenu"
  >
    {{ item.name }}
  </router-link>
</nav>
```

---

## 🔍 Route-based Features

### Context-Aware Components
```typescript
// Different behavior based on route type
const routeType = computed(() => {
  return route.meta.type || 'default';
});

// Show different components based on route
const showAddButton = computed(() => {
  return ['website', 'socialMedia', 'applications'].includes(routeType.value);
});
```

### Dynamic Page Titles
```typescript
// Set page title based on route
watchEffect(() => {
  const route = useRoute();
  const title = route.meta.name 
    ? `${$t(route.meta.name)} - Cepro.ai`
    : 'Cepro.ai';
  
  document.title = title;
});
```

---

## 🚀 Performance Optimization

### Lazy Loading Strategy
```typescript
// Route-based code splitting
{
  path: '/clients',
  component: () => import(
    /* webpackChunkName: "clients" */ 
    '@/views/Clients/index.vue'
  ),
},

// Module-based chunking
{
  path: '/dashboard-analytics',
  component: () => import(
    /* webpackChunkName: "analytics" */
    '@/views/analytics/Dashboard.vue'
  ),
},
```

### Preloading Critical Routes
```typescript
// Preload important routes
router.beforeEach((to, from, next) => {
  // Preload dashboard components
  if (to.path === '/') {
    import('@/components/Dashboard/Charts.vue');
    import('@/components/Dashboard/Widgets.vue');
  }
  
  next();
});
```

---

## 🧪 Testing Routes

### Route Testing Setup
```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { mount } from '@vue/test-utils';

const router = createRouter({
  history: createWebHistory(),
  routes: testRoutes,
});

const wrapper = mount(Component, {
  global: {
    plugins: [router],
  },
});
```

### Navigation Testing
```typescript
// Test programmatic navigation
it('should navigate to client details', async () => {
  const wrapper = mount(ClientsList, { router });
  
  await wrapper.find('[data-test="view-client"]').trigger('click');
  
  expect(router.currentRoute.value.path).toBe('/clients/details/123');
});
```

---

## 📋 Route Documentation

### Route Registry
| Path | Component | Purpose | Permissions |
|------|-----------|---------|-------------|
| `/` | Dashboard | Main dashboard | All users |
| `/website` | Website Module | Website incidents | Website access |
| `/socialMedia` | Social Media Module | Social media incidents | Social media access |
| `/applications` | Applications Module | App incidents | Applications access |
| `/accounts` | Account Management | User management | Admin only |
| `/clients` | Client Management | Client management | Admin/Distributor |
| `/distributor` | Distributor Management | Distributor management | Admin only |

---

*This routing documentation provides a comprehensive guide to navigation in Cepro.ai. For specific implementation details, refer to the component documentation and state management guides.*
