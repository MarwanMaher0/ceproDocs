# Theming & Styling

## 🎨 Theme System Overview

Cepro.ai features a sophisticated theming system built on TailwindCSS with dynamic theme switching, custom color schemes, and comprehensive dark mode support. The theme system supports light, dark, and system preference modes with full customization capabilities.

## 🛠️ TailwindCSS Configuration

### Main Configuration (`tailwind.config.cjs`)

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Primary color scheme
        primary: {
          DEFAULT: 'rgb(var(--primary-default) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)',
        },
        
        // Secondary colors
        secondary: {
          DEFAULT: 'rgb(var(--secondary-default) / <alpha-value>)',
          light: 'rgb(var(--secondary-light) / <alpha-value>)',
          dark: 'rgb(var(--secondary-dark) / <alpha-value>)',
        },
        
        // Dark mode specific colors
        'white-dark': '#e0e6ed',
        'white-light': '#ebedf2',
        'dark': '#1b2e4b',
        'dark-light': '#253b5c',
        
        // Status colors
        success: '#00ab55',
        warning: '#e7515a',
        info: '#2196f3',
        danger: '#e7515a',
      },
      
      fontFamily: {
        // Custom fonts
        'nunito': ['Nunito', 'sans-serif'],
        'Uto': ['Uto', 'sans-serif'],
        'omniaArabic': ['OmniaArabic', 'sans-serif'],
      },
      
      spacing: {
        // Custom spacing
        '18': '4.5rem',
        '88': '22rem',
      },
      
      animation: {
        // Custom animations
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

---

## 🎭 Dynamic Theme System

### Theme Store (`/src/stores/useThemeStore.ts`)

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

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    theme: reactive({
      dark_logo: '',
      light_logo: '',
      icon_logo: '',
      primemary: {
        light: '#4361ee',
        dark: '#1e40af',
      },
      secondary: {
        light: '#805dca',
        dark: '#6366f1',
      },
    }),
  }),
  
  actions: {
    updateTheme(newTheme: Partial<ThemeState['theme']>) {
      Object.assign(this.theme, newTheme);
      this.applyThemeVariables();
    },
    
    applyThemeVariables() {
      const root = document.documentElement;
      
      // Apply CSS custom properties
      root.style.setProperty('--primary-default', this.theme.primemary.light);
      root.style.setProperty('--primary-light', this.theme.primemary.dark);
      root.style.setProperty('--secondary-default', this.theme.secondary.light);
      root.style.setProperty('--secondary-light', this.theme.secondary.dark);
    },
  },
});
```

### App Store Theme Management

```typescript
// Main app store theme actions
toggleTheme(payload: 'light' | 'dark' | 'system') {
  this.theme = payload;
  localStorage.setItem('theme', payload);
  
  if (payload === 'light') {
    this.isDarkMode = false;
  } else if (payload === 'dark') {
    this.isDarkMode = true;
  } else if (payload === 'system') {
    // Follow system preference
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (this.theme === 'system') {
          this.isDarkMode = e.matches;
          this.applyThemeClass();
        }
      });
  }
  
  this.applyThemeClass();
},

applyThemeClass() {
  if (this.isDarkMode) {
    document.querySelector('body')?.classList.add('dark');
  } else {
    document.querySelector('body')?.classList.remove('dark');
  }
}
```

---

## 🎨 Custom Color System

### CSS Custom Properties

```css
/* /src/assets/css/app.css */
:root {
  /* Primary colors */
  --primary-default: 67, 97, 238;
  --primary-light: 67, 97, 238;
  --primary-dark: 30, 64, 175;
  
  /* Secondary colors */
  --secondary-default: 128, 93, 202;
  --secondary-light: 128, 93, 202;
  --secondary-dark: 99, 102, 241;
  
  /* Neutral colors */
  --gray-50: 249, 250, 251;
  --gray-100: 243, 244, 246;
  --gray-900: 17, 24, 39;
  
  /* Status colors */
  --success: 0, 171, 85;
  --warning: 251, 191, 36;
  --error: 239, 68, 68;
  --info: 59, 130, 246;
}

/* Dark mode overrides */
.dark {
  --gray-50: 17, 24, 39;
  --gray-100: 31, 41, 55;
  --gray-900: 249, 250, 251;
}
```

### Color Utility Classes

```css
/* Primary color utilities */
.text-primary {
  color: rgb(var(--primary-default));
}

.bg-primary {
  background-color: rgb(var(--primary-default));
}

.border-primary {
  border-color: rgb(var(--primary-default));
}

/* Primary variations */
.bg-primary-light {
  background-color: rgb(var(--primary-light) / 0.1);
}

.bg-primary-dark {
  background-color: rgb(var(--primary-dark));
}

/* Responsive and state variants */
.hover:bg-primary:hover {
  background-color: rgb(var(--primary-default));
}

.focus:ring-primary:focus {
  --tw-ring-color: rgb(var(--primary-default));
}
```

---

## 🌙 Dark Mode Implementation

### Dark Mode Classes

```css
/* Light mode styles */
.bg-white {
  background-color: #ffffff;
}

.text-black {
  color: #000000;
}

/* Dark mode overrides */
.dark .bg-white {
  background-color: #1b2e4b;
}

.dark .text-black {
  color: #ffffff;
}

.dark .text-white-dark {
  color: #e0e6ed;
}

/* Component-specific dark mode styles */
.panel {
  @apply bg-white dark:bg-[#1b2e4b] rounded-lg shadow-sm;
}

.form-input {
  @apply bg-white dark:bg-[#1b2e4b] border-gray-300 dark:border-gray-600 
         text-black dark:text-white;
}
```

### Dark Mode Component Example

```vue
<template>
  <div class="panel">
    <h3 class="text-lg font-semibold text-black dark:text-white">
      {{ title }}
    </h3>
    
    <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
      <p class="text-gray-700 dark:text-gray-300">
        {{ content }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.panel {
  @apply bg-white dark:bg-[#1b2e4b] shadow-lg rounded-lg p-6;
  border: 1px solid rgb(224 230 237 / 0.5);
}

.dark .panel {
  border-color: rgb(27 46 75 / 0.5);
}
</style>
```

---

## 🎨 Theme Customizer Component

### Theme Customizer (`/src/components/ThemeCustomizer.vue`)

```vue
<template>
  <div class="theme-customizer">
    <!-- Color Scheme Selection -->
    <div class="customizer-section">
      <h5 class="section-title">Color Scheme</h5>
      <div class="theme-options">
        <button
          v-for="theme in themeOptions"
          :key="theme.value"
          @click="store.toggleTheme(theme.value)"
          :class="[
            'theme-btn',
            { 'active': store.theme === theme.value }
          ]"
        >
          <component :is="theme.icon" class="w-5 h-5" />
          {{ theme.label }}
        </button>
      </div>
    </div>
    
    <!-- Layout Options -->
    <div class="customizer-section">
      <h5 class="section-title">Navigation Position</h5>
      <div class="layout-options">
        <button
          v-for="layout in layoutOptions"
          :key="layout.value"
          @click="store.toggleMenu(layout.value)"
          :class="[
            'layout-btn',
            { 'active': store.menu === layout.value }
          ]"
        >
          {{ layout.label }}
        </button>
      </div>
    </div>
    
    <!-- RTL Toggle -->
    <div class="customizer-section">
      <h5 class="section-title">Direction</h5>
      <div class="direction-options">
        <button
          @click="store.toggleRTL('ltr')"
          :class="{ 'active': store.rtlClass === 'ltr' }"
        >
          LTR
        </button>
        <button
          @click="store.toggleRTL('rtl')"
          :class="{ 'active': store.rtlClass === 'rtl' }"
        >
          RTL
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/index';
import IconSun from '@/components/icon/icon-sun.vue';
import IconMoon from '@/components/icon/icon-moon.vue';
import IconLaptop from '@/components/icon/icon-laptop.vue';

const store = useAppStore();

const themeOptions = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'system', label: 'System', icon: IconLaptop },
];

const layoutOptions = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'collapsible-vertical', label: 'Collapsible' },
];
</script>
```

---

## 🎯 Component Styling Patterns

### Base Component Styles

```css
/* Button components */
.btn {
  @apply inline-flex items-center px-4 py-2 rounded-lg font-medium 
         transition-all duration-200 focus:outline-none focus:ring-2;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark 
         focus:ring-primary focus:ring-opacity-50;
}

.btn-outline-primary {
  @apply border border-primary text-primary hover:bg-primary 
         hover:text-white focus:ring-primary;
}

/* Form components */
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
         rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white
         focus:ring-2 focus:ring-primary focus:border-transparent;
}

.form-select {
  @apply form-input appearance-none bg-no-repeat bg-right 
         bg-[length:16px_12px] pr-8;
  background-image: url("data:image/svg+xml,...");
}

/* Panel components */
.panel {
  @apply bg-white dark:bg-[#1b2e4b] rounded-lg shadow-sm 
         border border-gray-200 dark:border-gray-700;
}
```

### Responsive Design Classes

```css
/* Responsive grid system */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6;
}

/* Responsive text sizes */
.text-responsive {
  @apply text-sm md:text-base lg:text-lg;
}

/* Responsive spacing */
.spacing-responsive {
  @apply p-4 md:p-6 lg:p-8;
}

/* Mobile-first breakpoints */
@screen sm {
  .mobile-hidden {
    @apply hidden;
  }
}

@screen lg {
  .desktop-only {
    @apply block;
  }
}
```

---

## 🌍 RTL-Aware Styling

### RTL Layout Classes

```css
/* Flexbox direction for RTL */
.flex-rtl {
  @apply flex ltr:flex-row rtl:flex-row-reverse;
}

/* Margin and padding for RTL */
.ml-rtl {
  @apply ltr:ml-4 rtl:mr-4;
}

.mr-rtl {
  @apply ltr:mr-4 rtl:ml-4;
}

/* Text alignment for RTL */
.text-start {
  @apply ltr:text-left rtl:text-right;
}

.text-end {
  @apply ltr:text-right rtl:text-left;
}

/* Border radius for RTL */
.rounded-start {
  @apply ltr:rounded-l rtl:rounded-r;
}

.rounded-end {
  @apply ltr:rounded-r rtl:rounded-l;
}
```

### RTL Component Example

```vue
<template>
  <div :class="[
    'navigation',
    'flex items-center',
    store.rtlClass
  ]">
    <div class="logo ml-rtl">
      <img :src="currentLogo" alt="Logo" />
    </div>
    
    <nav class="menu flex-rtl">
      <a 
        v-for="item in menuItems"
        :key="item.id"
        class="menu-item ml-rtl"
      >
        {{ item.label }}
      </a>
    </nav>
    
    <div class="actions mr-rtl">
      <button class="btn btn-primary">
        {{ $t('action') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/index';
import { useThemeStore } from '@/stores/useThemeStore';

const store = useAppStore();
const themeStore = useThemeStore();

const currentLogo = computed(() => {
  return store.isDarkMode 
    ? themeStore.theme.light_logo 
    : themeStore.theme.dark_logo;
});
</script>
```

---

## 🎨 Custom Font Integration

### Font Loading

```css
/* /src/assets/css/app.css */

/* English fonts */
@font-face {
  font-family: 'Uto';
  src: url('/assets/English Typeface/Uto-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Uto';
  src: url('/assets/English Typeface/Uto-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Arabic fonts */
@font-face {
  font-family: 'OmniaArabic';
  src: url('/assets/Arabic Typeface/OmniaArabicITF-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'OmniaArabic';
  src: url('/assets/Arabic Typeface/OmniaArabicITF-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Dynamic Font Switching

```vue
<template>
  <div :class="[
    'app-container',
    store.isArabic ? 'font-omniaArabic' : 'font-Uto'
  ]">
    <!-- App content -->
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/index';

const store = useAppStore();
</script>
```

---

## ⚡ Performance Optimization

### CSS Optimization

```css
/* Critical CSS inlining */
.critical-styles {
  /* Above-the-fold styles */
  @apply bg-white text-black font-sans;
}

/* Non-critical styles loaded asynchronously */
@media print {
  .print-hidden {
    @apply hidden;
  }
}
```

### Purge Configuration

```javascript
// tailwind.config.cjs
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    // Dynamic classes that might be purged
    'bg-primary',
    'text-primary',
    'dark:bg-gray-800',
    /^(bg|text|border)-(red|green|blue|yellow)-(100|200|300|400|500|600|700|800|900)$/,
  ],
};
```

### Theme Performance

```typescript
// Debounced theme changes
import { debounce } from 'lodash-es';

const debouncedThemeChange = debounce((theme: string) => {
  store.toggleTheme(theme);
}, 100);

// Efficient CSS variable updates
const updateThemeVariables = (variables: Record<string, string>) => {
  const root = document.documentElement;
  const batch = Object.entries(variables);
  
  // Batch DOM updates
  requestAnimationFrame(() => {
    batch.forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  });
};
```

---

## 🧪 Testing Themes

### Theme Testing Setup

```typescript
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

describe('Theme System', () => {
  const createWrapper = (theme = 'light') => {
    return mount(Component, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { theme, isDarkMode: theme === 'dark' },
            },
          }),
        ],
      },
    });
  };
  
  it('applies light theme correctly', () => {
    const wrapper = createWrapper('light');
    expect(wrapper.classes()).not.toContain('dark');
  });
  
  it('applies dark theme correctly', () => {
    const wrapper = createWrapper('dark');
    expect(document.body.classList).toContain('dark');
  });
});
```

---

## 📱 Responsive Design

### Breakpoint Strategy

```css
/* Mobile-first approach */
.responsive-component {
  /* Mobile styles (default) */
  @apply p-4 text-sm;
  
  /* Tablet styles */
  @screen md {
    @apply p-6 text-base;
  }
  
  /* Desktop styles */
  @screen lg {
    @apply p-8 text-lg;
  }
  
  /* Large desktop styles */
  @screen xl {
    @apply p-12 text-xl;
  }
}
```

### Container Queries (Future)

```css
/* Container-based responsive design */
@container (min-width: 400px) {
  .card {
    @apply grid-cols-2;
  }
}

@container (min-width: 600px) {
  .card {
    @apply grid-cols-3;
  }
}
```

---

*This theming and styling documentation provides comprehensive guidance for implementing and customizing the visual design system in Cepro.ai. For specific component styling examples, refer to the component documentation and TailwindCSS utilities.*
