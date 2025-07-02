# Architecture & Structure

## 🏗️ Technical Architecture

### Frontend Architecture Overview

Cepro.ai follows a modern, component-based architecture built on Vue.js 3 with TypeScript. The application uses a modular design pattern that promotes reusability, maintainability, and scalability.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Vue Components  │  Layouts  │  Pages  │  Composables      │
├─────────────────────────────────────────────────────────────┤
│                    State Management                         │
├─────────────────────────────────────────────────────────────┤
│  Pinia Stores    │  Global State  │  Local State          │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│  API Services    │  Utilities     │  Interceptors          │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure                           │
├─────────────────────────────────────────────────────────────┤
│  Vue Router      │  Axios HTTP    │  i18n                  │
└─────────────────────────────────────────────────────────────┘
```

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Vue.js | 3.2.37 | Core frontend framework |
| TypeScript | 4.6.4 | Type safety and developer experience |
| Vite | 3.1.0 | Build tool and development server |
| Pinia | 2.0.22 | State management |
| Vue Router | 4.1.5 | Client-side routing |
| TailwindCSS | 3.4.1 | Utility-first CSS framework |
| Axios | 1.9.0 | HTTP client for API communication |

## 📁 Project Structure

### Root Directory Structure

```
cepro/
├── public/                    # Static assets
│   ├── assets/               # Images, fonts, icons
│   └── demo-prepare.html     # Demo configuration
├── src/                      # Source code
│   ├── assets/              # Application assets
│   ├── components/          # Reusable components
│   ├── composables/         # Vue composition functions
│   ├── features/            # Feature-specific modules
│   ├── layouts/             # Application layouts
│   ├── locales/             # Internationalization files
│   ├── router/              # Vue Router configuration
│   ├── services/            # API services and utilities
│   ├── stores/              # Pinia state stores
│   ├── utils/               # Utility functions
│   └── views/               # Page components
├── server-configs/          # Server configuration files
├── documentation/           # Project documentation
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.cjs     # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── theme.config.ts         # Application theme configuration
```

### Source Code Organization (`src/`)

#### Components Directory (`/src/components/`)
```
components/
├── layout/                  # Layout components
│   ├── Header.vue          # Main navigation header
│   ├── Sidebar.vue         # Navigation sidebar
│   └── Footer.vue          # Application footer
├── icon/                   # Icon components
│   ├── menu/               # Menu-specific icons
│   └── *.vue               # Individual icon components
├── AccountsTable.vue       # User accounts table
├── Table.vue               # Generic reusable table
├── ThemeCustomizer.vue     # Theme configuration panel
├── SkeletonLoader.vue      # Loading state components
└── *.vue                   # Other reusable components
```

#### Views Directory (`/src/views/`)
```
views/
├── index.vue               # Dashboard/home page
├── accounts/               # User management
│   ├── index.vue          # Accounts listing
│   ├── AddNewAdmin/       # Add administrator
│   └── EditAdmin/         # Edit administrator
├── applications/           # Application incidents
│   ├── index.vue          # Applications dashboard
│   ├── AddNewIncident/    # Create incident
│   ├── IncidentDetails/   # Incident details
│   └── TakedownDetails/   # Takedown details
├── Clients/                # Client management
│   ├── index.vue          # Clients listing
│   ├── add/               # Add new client
│   ├── edit/              # Edit client
│   └── details/           # Client details
├── Distributor/            # Distributor management
│   ├── index.vue          # Distributors listing
│   ├── add/               # Add distributor
│   ├── edit/              # Edit distributor
│   └── details/           # Distributor details
├── socialMedia/            # Social media incidents
├── website/                # Website incidents
├── profile/                # User profiles
│   ├── admin.vue          # Admin profile
│   └── distributor.vue    # Distributor profile
├── auth/                   # Authentication pages
├── pages/                  # Static/utility pages
└── services/               # View-specific services
```

#### State Management (`/src/stores/`)
```
stores/
├── index.ts                # Main application store
├── useMyDataStore.ts       # User data store
├── usePermissionsStore.ts  # User permissions store
├── useThemeStore.ts        # Theme configuration store
└── businessFields.ts       # Business fields data
```

#### Services & API (`/src/services/`)
```
services/
├── axiosInstance.ts        # Axios configuration and interceptors
└── validationRules.ts      # Form validation rules
```

#### Utilities (`/src/utils/`)
```
utils/
├── myData.ts              # User data utilities
├── permissions.ts         # Permission checking utilities
└── theme.ts               # Theme utilities
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [
    vue(),                    // Vue.js support
    vueDevTools(),           // Vue DevTools integration
    AutoImport({             // Automatic imports
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@axios': resolve(__dirname, './src/services/axiosInstance.ts'),
    },
  },
  // Build and optimization settings
});
```

### TypeScript Configuration
- **tsconfig.json**: Main TypeScript configuration
- **tsconfig.node.json**: Node.js specific configuration
- **auto-imports.d.ts**: Generated type definitions for auto-imports

### TailwindCSS Configuration (`tailwind.config.cjs`)
- Custom color schemes and design tokens
- Component-specific utility classes
- Responsive breakpoints
- Dark mode configuration

## 🎨 Layout System

### Layout Components

#### 1. App Layout (`/src/layouts/app-layout.vue`)
- Main application layout for authenticated users
- Includes header, sidebar, and content area
- Handles theme switching and responsive behavior
- Manages loading states and transitions

#### 2. Auth Layout (`/src/layouts/auth-layout.vue`)
- Layout for authentication pages (login, register)
- Minimal design focused on authentication forms
- Separate styling and branding

### Layout Switching Logic
```typescript
// App.vue - Dynamic layout switching
const mainLayout = computed(() => {
  return store.mainLayout === 'auth' ? authLayout : appLayout;
});
```

## 🛣️ Routing Architecture

### Route Organization
```typescript
// /src/router/index.ts
const routes: RouteRecordRaw[] = [
  // Dashboard
  { path: '/', name: 'home', component: HomeView },
  
  // Feature-based routing
  { path: '/website/*', component: WebsiteModule },
  { path: '/socialMedia/*', component: SocialMediaModule },
  { path: '/applications/*', component: ApplicationsModule },
  
  // Admin routes
  { path: '/accounts/*', component: AccountsModule },
  { path: '/clients/*', component: ClientsModule },
  { path: '/distributor/*', component: DistributorModule },
];
```

### Route Meta Information
- **name**: Route identifier for navigation
- **layout**: Specify which layout to use
- **type**: Module type for context-aware features
- **permissions**: Required permissions for access

## 🔄 Data Flow Architecture

### State Management Flow
```
Component → Action → Store → API Service → Backend
    ↑                                          ↓
    └──────── Reactive Update ←── Response ←───┘
```

### Component Communication
1. **Parent-Child**: Props and emits
2. **Sibling Components**: Shared Pinia stores
3. **Global State**: Central Pinia stores
4. **Event Bus**: For decoupled communication

## 🏗️ Module Architecture

### Feature-Based Modules
Each major feature (Website, Social Media, Applications) follows a consistent structure:

```
feature-module/
├── index.vue              # Module dashboard
├── AddNewIncident/        # Create functionality
├── IncidentDetails/       # View functionality
├── EditIncident/          # Edit functionality
├── TakedownDetails/       # Takedown management
└── services/              # Module-specific API services
```

### Shared Components
- **Table.vue**: Generic data table with sorting, pagination, and actions
- **SkeletonLoader.vue**: Loading states for different content types
- **ReusableModal.vue**: Generic modal component
- **ThemeCustomizer.vue**: Theme configuration interface

## 🔌 Plugin Architecture

### Vue Plugins Integration
```typescript
// main.ts - Plugin registration
app.use(createPinia());           // State management
app.use(router);                  // Routing
app.use(i18n);                    // Internationalization
app.use(PerfectScrollbar);        // Scrollbar enhancement
app.use(TippyPlugin);             // Tooltips
app.use(VueToast);                // Notifications
```

### Auto-Import System
Automatically imports frequently used Vue APIs:
- `ref`, `reactive`, `computed`
- `onMounted`, `onUnmounted`
- `watch`, `watchEffect`
- Custom composables

## 📱 Responsive Design Architecture

### Breakpoint Strategy
```css
/* TailwindCSS breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### Mobile-First Approach
- Default styles for mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interfaces
- Optimized navigation for mobile

## 🔒 Security Architecture

### Authentication Flow
```
Login → JWT Token → Local Storage → Axios Interceptor → API Request
   ↓
Token Refresh Logic → Automatic Renewal → Seamless UX
```

### Authorization Layers
1. **Route Guards**: Protect routes based on authentication
2. **Component Guards**: Hide/show components based on permissions
3. **API Guards**: Server-side validation and authorization
4. **Store Guards**: Prevent unauthorized state modifications

---

*This architecture documentation provides the foundation for understanding how Cepro.ai is structured and organized. For specific implementation details, refer to the component and API documentation sections.*
