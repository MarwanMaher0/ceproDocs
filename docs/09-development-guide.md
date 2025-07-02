# Development Guide

## 🚀 Getting Started

This guide provides comprehensive instructions for setting up the development environment, understanding the build process, and following the development workflow for Cepro.ai.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher (or Yarn 1.22.0+)
- **Git**: Latest version
- **Browser**: Modern browser supporting ES2020+ (Chrome 80+, Firefox 78+, Safari 14+)

### Development Tools (Recommended)
- **VS Code**: With Vue.js extensions
- **Vue DevTools**: Browser extension for Vue.js debugging
- **Vite DevTools**: For build optimization insights

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://gitlab.com/digitee.io/cepro.git
cd cepro
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.development

# Edit environment variables
nano .env.development
```

### Environment Variables
```bash
# .env.development
VITE_API_BASE_URL=https://dev-api.cepro.ai/api/v1
VITE_APP_NAME=Cepro.ai
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_USE_MOCK_API=false

# Optional: Analytics and monitoring
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### 4. Start Development Server
```bash
# Start dev server with hot reload
npm run dev

# Alternative with specific port
npm run dev -- --port 3000
```

The application will be available at `http://localhost:5173` (default Vite port).

---

## 📦 Package.json Scripts

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite",                           // Start development server
    "build": "vue-tsc --noEmit && vite build", // Production build
    "preview": "vite preview",               // Preview production build
    "type-check": "vue-tsc --noEmit",       // TypeScript type checking
    "lint": "eslint src --ext .vue,.js,.ts", // ESLint linting
    "lint:fix": "eslint src --ext .vue,.js,.ts --fix", // Auto-fix linting
    "format": "prettier --write src/",      // Format code with Prettier
    "test": "vitest",                       // Run unit tests
    "test:coverage": "vitest --coverage",   // Run tests with coverage
    "analyze": "vite-bundle-analyzer"       // Analyze bundle size
  }
}
```

### Dependencies Overview

#### Core Dependencies
```json
{
  "vue": "^3.2.37",           // Vue.js framework
  "vue-router": "^4.1.5",     // Client-side routing
  "pinia": "^2.0.22",         // State management
  "axios": "^1.9.0",          // HTTP client
  "vue-i18n": "^9.2.2"       // Internationalization
}
```

#### UI & Styling
```json
{
  "tailwindcss": "^3.4.1",           // Utility-first CSS
  "@headlessui/vue": "^1.7.3",       // Unstyled UI components
  "apexcharts": "^3.54.1",           // Charts and graphs
  "vue3-apexcharts": "1.4.0",        // Vue wrapper for ApexCharts
  "swiper": "^8.4.4"                 // Touch slider component
}
```

#### Development Tools
```json
{
  "vite": "^3.1.0",                    // Build tool
  "typescript": "^4.6.4",             // TypeScript support
  "@vitejs/plugin-vue": "^3.1.0",     // Vue plugin for Vite
  "unplugin-auto-import": "^19.3.0"   // Automatic imports
}
```

---

## 🏗️ Build Process

### Development Build
```bash
# Start development server
npm run dev

# Features:
# - Hot Module Replacement (HMR)
# - Fast refresh for Vue components
# - TypeScript compilation
# - Auto-import resolution
# - CSS preprocessing
```

### Production Build
```bash
# Create production build
npm run build

# Build output directory: dist/
# Features:
# - Code splitting
# - Tree shaking
# - Minification
# - Asset optimization
# - TypeScript type checking
```

### Build Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), // Vue DevTools integration
    AutoImport({
      imports: ['vue'], // Auto-import Vue APIs
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@axios': resolve(__dirname, './src/services/axiosInstance.ts'),
    },
  },
  
  build: {
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting strategy
          vendor: ['vue', 'vue-router', 'pinia'],
          charts: ['apexcharts', 'vue3-apexcharts'],
          ui: ['@headlessui/vue', 'swiper'],
        },
      },
    },
  },
  
  optimizeDeps: {
    include: ['quill'], // Pre-bundle dependencies
  },
});
```

---

## 🔧 Development Workflow

### 1. Feature Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-dashboard-widget

# 2. Start development server
npm run dev

# 3. Make changes with hot reload
# Edit files in src/

# 4. Run type checking
npm run type-check

# 5. Run linting
npm run lint:fix

# 6. Test changes
npm run test

# 7. Commit changes
git add .
git commit -m "feat: add new dashboard widget"

# 8. Push branch
git push origin feature/new-dashboard-widget
```

### 2. Code Quality Checks
```bash
# Run all quality checks
npm run type-check && npm run lint && npm run test

# Auto-fix common issues
npm run lint:fix
npm run format
```

### 3. Build Verification
```bash
# Build and preview locally
npm run build
npm run preview

# Analyze bundle size
npm run analyze
```

---

## 🔧 IDE Configuration

### VS Code Setup

#### Recommended Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "Vue.volar",                    // Vue Language Features
    "Vue.vscode-typescript-vue-plugin", // TypeScript Vue Plugin
    "bradlc.vscode-tailwindcss",    // TailwindCSS IntelliSense
    "esbenp.prettier-vscode",       // Prettier formatter
    "dbaeumer.vscode-eslint",       // ESLint
    "ms-vscode.vscode-typescript-next", // TypeScript support
    "formulahendry.auto-rename-tag", // Auto rename paired tags
    "christian-kohler.path-intellisense" // Path autocomplete
  ]
}
```

#### VS Code Settings
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.complete.casing.tags": "kebab",
  "vue.complete.casing.props": "camel",
  "tailwindCSS.includeLanguages": {
    "vue": "html",
    "vue-html": "html"
  },
  "files.associations": {
    "*.vue": "vue"
  }
}
```

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/no-unused-vars': 'error',
    'vue/script-setup-uses-vars': 'error',
  },
};
```

### Prettier Configuration
```json
// .prettierrc.json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "vueIndentScriptAndStyle": false
}
```

---

## 🧪 Testing Setup

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup File
```typescript
// tests/setup.ts
import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createTestingPinia } from '@pinia/testing';

// Global test configuration
config.global.plugins = [
  createI18n({
    locale: 'en',
    messages: { en: {}, ae: {} },
  }),
  createTestingPinia(),
];
```

### Sample Test
```typescript
// tests/components/Button.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from '@/components/Button.vue';

describe('Button Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { text: 'Click me' },
    });
    
    expect(wrapper.text()).toContain('Click me');
  });
  
  it('emits click event', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```

---

## 📊 Performance Monitoring

### Bundle Analysis
```bash
# Generate bundle report
npm run build -- --analyze

# Or using webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js
```

### Performance Metrics
```typescript
// Performance monitoring in development
if (import.meta.env.DEV) {
  // Monitor component render times
  app.config.performance = true;
  
  // Log performance metrics
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log('Performance:', entry.name, entry.duration);
    });
  }).observe({ entryTypes: ['measure'] });
}
```

---

## 🔄 Hot Module Replacement (HMR)

### Vue HMR Configuration
```typescript
// Automatic HMR for Vue components
if (import.meta.hot) {
  import.meta.hot.accept('./App.vue', (newModule) => {
    // HMR update handling
  });
}
```

### Store HMR
```typescript
// Pinia store HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or start on different port
npm run dev -- --port 3000
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Restart TypeScript service in VS Code
# Command Palette > TypeScript: Restart TS Server

# Or run type check
npm run type-check
```

#### Build Failures
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=vite:* npm run dev

# Enable Vue DevTools
VITE_DEBUG=true npm run dev
```

---

## 📱 Mobile Development

### Mobile Testing
```bash
# Expose dev server to network
npm run dev -- --host

# Access from mobile device
# http://YOUR_IP:5173
```

### Responsive Development
```css
/* Use Chrome DevTools device emulation */
/* Test on actual devices when possible */

/* Responsive breakpoint testing */
@media (max-width: 640px) {
  .mobile-test {
    background: red; /* Visible indicator */
  }
}
```

---

## 🔒 Security Considerations

### Development Security
```typescript
// Environment variable validation
if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

// CSP headers for development
if (import.meta.env.DEV) {
  // Relaxed CSP for development
  document.head.appendChild(
    Object.assign(document.createElement('meta'), {
      httpEquiv: 'Content-Security-Policy',
      content: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:",
    })
  );
}
```

---

## 📚 Learning Resources

### Vue.js Resources
- [Vue.js Official Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)

### Build Tools
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### Styling
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [HeadlessUI Vue](https://headlessui.com/vue/)

---

*This development guide provides everything needed to start contributing to Cepro.ai. For specific feature implementation details, refer to the component and API documentation sections.*
