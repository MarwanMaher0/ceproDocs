# Components Guide

## 🧩 Component Overview

Cepro.ai follows a component-based architecture with reusable, modular components organized by functionality and scope. This guide covers all major components, their purposes, and usage patterns.

## 📁 Component Categories

### Layout Components
### Shared/Reusable Components
### Page Components
### Feature-Specific Components
### Icon Components

---

## 🏗️ Layout Components

### Header Component (`/src/components/layout/Header.vue`)

**Purpose**: Main navigation header with breadcrumbs, user menu, and theme controls.

**Key Features**:
- Dynamic breadcrumb navigation
- User profile dropdown
- Theme toggle (light/dark/system)
- Language switcher
- Responsive mobile menu trigger

**Props**: None (uses global stores)

**Usage**:
```vue
<Header />
```

**Key Functionality**:
- Role-based navigation menu rendering
- Real-time theme switching
- Internationalization support
- User session management

### Sidebar Component (`/src/components/layout/Sidebar.vue`)

**Purpose**: Main navigation sidebar with role-based menu items.

**Key Features**:
- Dynamic menu based on user role
- Logo display with theme adaptation
- Collapsible navigation groups
- Active route highlighting

**Props**: None (uses global stores)

**Navigation Structure**:
```typescript
const menus = computed(() => [
  { name: 'dashboard', route: '/', icon: IconMenuDashboard },
  { name: 'website', route: '/website', icon: IconMenuPages },
  { name: 'social_media', route: '/socialMedia', icon: IconMenuApps },
  { name: 'applications', route: '/applications', icon: IconMenuComponents },
  // Admin-only items
  ...(isAdmin.value ? [
    { name: 'accounts', route: '/accounts', icon: IconMenuUsers },
    { name: 'distributor', route: '/distributor', icon: IconDistributors }
  ] : []),
  // Distributor/Admin items
  ...(isAdmin.value || isDistributor.value ? [
    { name: 'clients', route: '/clients', icon: IconCercleClient }
  ] : []),
]);
```

---

## 🔄 Shared/Reusable Components

### Table Component (`/src/components/Table.vue`)

**Purpose**: Generic, feature-rich data table component used throughout the application.

**Key Features**:
- Sorting by columns
- Pagination with customizable page sizes
- Action buttons (view, edit, delete)
- Loading states
- Responsive design
- Internationalization support

**Props**:
```typescript
interface TableProps {
  loading: boolean;
  cols: Array<{
    field: string;
    title: string;
    sort?: boolean;
    class?: string;
  }>;
  rows: Array<any>;
  pagination: {
    total_items: number;
    total_pages: number;
    page_number: number;
    page_size: number;
    has_previous: boolean;
    has_next: boolean;
  };
  total_pages: number;
  onView?: Function;
  onEdit?: Function;
  onDelete?: Function;
  onChange: Function;
  content?: string; // Delete confirmation message
}
```

**Usage Example**:
```vue
<Table
  :loading="isLoading"
  :cols="columns"
  :rows="data"
  :pagination="paginationData"
  :total_pages="totalPages"
  :onView="handleView"
  :onEdit="handleEdit"
  :onDelete="handleDelete"
  :onChange="handlePageChange"
  :content="$t('delete_confirmation')"
/>
```

### SkeletonLoader Component (`/src/components/SkeletonLoader.vue`)

**Purpose**: Loading state component with different skeleton types for various content layouts.

**Types Available**:
- `dashboard`: Dashboard-specific loading skeleton
- `table`: Table loading skeleton
- `form`: Form loading skeleton
- `default`: Generic loading skeleton

**Props**:
```typescript
interface SkeletonProps {
  type?: 'dashboard' | 'table' | 'form' | 'default';
}
```

**Usage**:
```vue
<SkeletonLoader :type="'dashboard'" v-show="isLoading" />
```

### ReusableModal Component (`/src/components/ReusableModal.vue`)

**Purpose**: Generic modal component for dialogs, confirmations, and content display.

**Features**:
- Backdrop click to close
- ESC key support
- Customizable sizes
- Animation transitions
- Accessibility support

### ThemeCustomizer Component (`/src/components/ThemeCustomizer.vue`)

**Purpose**: Theme configuration panel for customizing application appearance.

**Features**:
- Color scheme selection (light/dark/system)
- Navigation position (horizontal/vertical/collapsible)
- Layout options (full/boxed)
- RTL/LTR direction toggle
- Animation preferences
- Navbar styles

---

## 📊 Dashboard Components

### Map Component (`/src/components/map.vue`)

**Purpose**: Interactive world map showing geographic distribution of incidents.

**Features**:
- Country-based incident visualization
- Hover effects with incident counts
- Responsive SVG-based map
- Theme-aware coloring

### Chart Components

#### TakedownDurationChart (`/src/components/TakedownDurationChart.vue`)
- Displays takedown duration analytics
- Uses ApexCharts for visualization
- Responsive and theme-aware

#### IncidentsVsTakedownsChart (`/src/components/IncidentsVsTakedownsChart.vue`)
- Comparative chart for incidents vs takedowns
- Line or bar chart options
- Monthly/yearly trend analysis

#### CountryRadialChart (`/src/components/CountryRadialChart.vue`)
- Radial chart for country-wise statistics
- Top countries by incident count
- Interactive hover states

#### fraudperIndustry (`/src/components/fraudperIndustry.vue`)
- Industry-wise fraud analysis
- Segmented visualization
- Business field categorization

---

## 📄 Page Components

### Dashboard (`/src/views/index.vue`)

**Purpose**: Main dashboard providing overview of all activities and metrics.

**Key Sections**:
1. **Welcome Card**: Personalized greeting with key metrics
2. **Statistics Panels**: Incidents, takedowns, and clients overview
3. **Charts Section**: Various analytical charts
4. **Recent Activity**: Latest incidents and takedowns
5. **Geographic Map**: World map with incident distribution

**Data Sources**:
- `/dashboard/summary/` - Overall statistics
- `/stats/incidents-vs-takedowns/` - Trend data
- `/stats/takedown-durations/` - Duration analytics
- `/stats/top-countries/` - Geographic data

**Role-based Content**:
```typescript
// Different content based on user role
const isAdmin = computed(() => 
  myData.role === 'Cepro Admin' || myData.role === 'Super Admin'
);
```

### Incident Management Pages

#### Website Module (`/src/views/website/`)
- **index.vue**: Website incidents dashboard
- **AddNewIncident/**: Create new website incident
- **IncidentDetails/[id].vue**: View incident details
- **EditIncident/[id].vue**: Edit existing incident
- **TakedownDetails/[id].vue**: Takedown information
- **AddNewTakedown/**: Create takedown request

#### Social Media Module (`/src/views/socialMedia/`)
- Similar structure to website module
- Platform-specific fields and validation
- Social media platform integration

#### Applications Module (`/src/views/applications/`)
- App store incident management
- Mobile and web application monitoring
- Platform-specific metadata

### Administration Pages

#### Accounts Management (`/src/views/accounts/`)

**index.vue** - Admin accounts listing
```vue
<template>
  <div class="panel p-5">
    <h2 class="font-medium text-lg mb-4">{{ $t('admins') }}</h2>
    <Table
      :loading="isLoading"
      :cols="cols"
      :rows="admins"
      :pagination="pagination"
      :onEdit="handleEditIncident"
      :onDelete="handleDeleteIncident"
    />
  </div>
</template>
```

**AddNewAdmin/** - Create administrator
- Role assignment
- Permission configuration
- Contact information
- Service access rights

#### Client Management (`/src/views/Clients/`)

**Key Features**:
- Client organization management
- Service subscription configuration
- Brand details and logo management
- Business field categorization
- Incident statistics per client

**Data Structure**:
```typescript
interface ClientData {
  client_contact_name: string;
  contact_email: string;
  subscription_starts: string;
  subscription_ends: string;
  business_field: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  brand_details: {
    logo: File | null;
    icon_logo: File | null;
    name: string;
    description: string;
  };
}
```

#### Distributor Management (`/src/views/Distributor/`)

**Features**:
- Distributor network oversight
- Client portfolio management
- Performance analytics
- Subscription management

---

## 👤 Profile Components

### Admin Profile (`/src/views/profile/admin.vue`)

**Purpose**: Comprehensive admin dashboard with personal metrics and incident management.

**Sections**:
1. **Profile Information**: Contact details, subscription info
2. **Statistics**: Personal incident and takedown counts
3. **Recent Incidents**: Table of recent incidents created by admin
4. **Recent Takedowns**: Table of recent takedowns

**Features**:
- Personal performance metrics
- Direct incident management
- Quick action buttons
- Export capabilities

### Distributor Profile (`/src/views/profile/distributor.vue`)

**Purpose**: Distributor-specific analytics and client management dashboard.

**Sections**:
1. **Profile Overview**: Company information and statistics
2. **Client Growth Chart**: Visual representation of client growth
3. **Performance Metrics**: Distributor-specific KPIs

---

## 🎨 Icon Components

### Menu Icons (`/src/components/icon/menu/`)
- `icon-menu-dashboard.vue`: Dashboard icon
- `icon-menu-pages.vue`: Website pages icon
- `icon-menu-apps.vue`: Applications icon
- `icon-menu-components.vue`: Components icon
- `icon-menu-users.vue`: Users management icon

### Action Icons
- `icon-edit.vue`: Edit action
- `icon-trash.vue`: Delete action
- `icon-eye.vue`: View action
- `icon-plus.vue`: Add/create action

### Status Icons
- `icon-check.vue`: Success/completed status
- `icon-x.vue`: Error/cancelled status
- `icon-clock.vue`: Pending/in-progress status

---

## 🔧 Component Composition Patterns

### Composables Usage

#### useMeta Composable
```typescript
// Set page title and metadata
useMeta({ title: 'Dashboard - Cepro.ai' });
```

#### useI18n Integration
```typescript
const i18n = reactive(useI18n());
const $t = (key) => i18n.t(key);
```

### Store Integration
```typescript
// Using multiple stores in components
const store = useAppStore();
const myDataStore = useMyDataStore();
const themeStore = useThemeStore();

// Reactive data from stores
const myData = computed(() => ({
  name: myDataStore.myData[0] || '',
  email: myDataStore.myData[1] || '',
  role: myDataStore.myData[2] || '',
}));
```

### Props and Emits Pattern
```typescript
// Component props definition
const props = defineProps<{
  data: TableData[];
  loading: boolean;
  onAction?: (item: TableData) => void;
}>();

// Component emits
const emit = defineEmits<{
  update: [value: string];
  delete: [id: string];
}>();
```

---

## 🧪 Component Testing Patterns

### Unit Testing Approach
- Component isolation testing
- Props and emits validation
- Store integration testing
- Event handling verification

### Integration Testing
- Page-level component testing
- API integration testing
- User interaction flows
- Accessibility testing

---

*This component guide provides a comprehensive overview of all major components in Cepro.ai. For specific implementation details, refer to the individual component source files and the API integration documentation.*
