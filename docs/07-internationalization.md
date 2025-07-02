# Internationalization (i18n)

## 🌍 Multi-language Support

Cepro.ai provides comprehensive internationalization support using Vue I18n, enabling the application to serve users in multiple languages with full RTL (Right-to-Left) support for Arabic and other RTL languages.

## 🔧 I18n Configuration

### Vue I18n Setup (`/src/i18n.ts`)

```typescript
import { createI18n } from 'vue-i18n';

// Import locale files
import en from '@/locales/en.json';
import ae from '@/locales/ae.json';

export default createI18n({
  legacy: false,           // Use Composition API
  allowComposition: true,  // Allow composition API usage
  locale: 'en',           // Default locale
  globalInjection: true,  // Global $t function
  fallbackLocale: 'en',   // Fallback when translation missing
  messages: {
    en,
    ae,
  },
});
```

### Main Application Integration
```typescript
// main.ts
import i18n from '@/i18n';

const app = createApp(App);
app.use(i18n);
```

---

## 🗂️ Locale Files Structure

### English Locale (`/src/locales/en.json`)
```json
{
  "dashboard": "Dashboard",
  "website": "Website",
  "social_media": "Social Media",
  "applications": "Applications",
  "accounts": "Accounts",
  "clients": "Clients",
  "distributor": "Distributor",
  
  "incidents": "Incidents",
  "takedowns": "Takedowns",
  "add_new_incident": "Add New Incident",
  "incident_details": "Incident Details",
  "edit_incident": "Edit Incident",
  
  "client_name": "Client Name",
  "business_field": "Business Field",
  "contact_email": "Contact Email",
  "subscription_starts": "Subscription Starts",
  "subscription_ends": "Subscription Ends",
  
  "actions": "Actions",
  "view": "View",
  "edit": "Edit",
  "delete": "Delete",
  "save": "Save",
  "cancel": "Cancel",
  "confirm": "Confirm",
  
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "pending": "Pending",
    "completed": "Completed",
    "cancelled": "Cancelled"
  },
  
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email address",
    "min_length": "Minimum {count} characters required",
    "max_length": "Maximum {count} characters allowed"
  },
  
  "messages": {
    "success": {
      "created": "Item created successfully",
      "updated": "Item updated successfully",
      "deleted": "Item deleted successfully"
    },
    "error": {
      "network": "Network error. Please check your connection.",
      "server": "Server error. Please try again later.",
      "not_found": "The requested item was not found"
    }
  }
}
```

### Arabic Locale (`/src/locales/ae.json`)
```json
{
  "dashboard": "لوحة التحكم",
  "website": "الموقع الإلكتروني",
  "social_media": "وسائل التواصل الاجتماعي",
  "applications": "التطبيقات",
  "accounts": "الحسابات",
  "clients": "العملاء",
  "distributor": "الموزع",
  
  "incidents": "الحوادث",
  "takedowns": "عمليات الإزالة",
  "add_new_incident": "إضافة حادثة جديدة",
  "incident_details": "تفاصيل الحادثة",
  "edit_incident": "تعديل الحادثة",
  
  "client_name": "اسم العميل",
  "business_field": "مجال العمل",
  "contact_email": "البريد الإلكتروني للاتصال",
  "subscription_starts": "بداية الاشتراك",
  "subscription_ends": "نهاية الاشتراك",
  
  "actions": "الإجراءات",
  "view": "عرض",
  "edit": "تعديل",
  "delete": "حذف",
  "save": "حفظ",
  "cancel": "إلغاء",
  "confirm": "تأكيد",
  
  "status": {
    "active": "نشط",
    "inactive": "غير نشط",
    "pending": "في الانتظار",
    "completed": "مكتمل",
    "cancelled": "ملغي"
  },
  
  "validation": {
    "required": "هذا الحقل مطلوب",
    "email": "يرجى إدخال عنوان بريد إلكتروني صحيح",
    "min_length": "الحد الأدنى {count} أحرف مطلوب",
    "max_length": "الحد الأقصى {count} أحرف مسموح"
  },
  
  "messages": {
    "success": {
      "created": "تم إنشاء العنصر بنجاح",
      "updated": "تم تحديث العنصر بنجاح",
      "deleted": "تم حذف العنصر بنجاح"
    },
    "error": {
      "network": "خطأ في الشبكة. يرجى التحقق من اتصالك.",
      "server": "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.",
      "not_found": "العنصر المطلوب غير موجود"
    }
  }
}
```

---

## 🎯 Usage Patterns

### Composition API Usage
```typescript
// Using i18n in components with Composition API
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const { t, locale } = useI18n();
    
    // Simple translation
    const title = computed(() => t('dashboard'));
    
    // Translation with parameters
    const welcomeMessage = computed(() => 
      t('welcome_message', { name: 'John' })
    );
    
    // Change locale
    const switchLanguage = (lang: string) => {
      locale.value = lang;
    };
    
    return {
      title,
      welcomeMessage,
      switchLanguage,
    };
  },
});
```

### Template Usage
```vue
<template>
  <!-- Simple translation -->
  <h1>{{ $t('dashboard') }}</h1>
  
  <!-- Translation with parameters -->
  <p>{{ $t('welcome_message', { name: userName }) }}</p>
  
  <!-- Pluralization -->
  <span>{{ $tc('item_count', count, { count }) }}</span>
  
  <!-- Nested object translation -->
  <span>{{ $t('status.active') }}</span>
  
  <!-- Conditional translation -->
  <button>{{ isEditing ? $t('save') : $t('edit') }}</button>
  
  <!-- HTML content (use v-html with caution) -->
  <div v-html="$t('rich_content')"></div>
</template>
```

### Reactive Translation Function
```typescript
// Utility for reactive translations
const i18n = reactive(useI18n());

const $t = (key: string, params?: any) => {
  return i18n.t(key, params);
};

// Usage in components
const cols = ref([
  { field: 'id', title: $t('id') },
  { field: 'name', title: $t('name') },
  { field: 'email', title: $t('email') },
  { field: 'actions', title: $t('actions') },
]);
```

---

## 🌐 Language Switching

### Language Store Integration
```typescript
// App Store language management
const store = useAppStore();

const languageList = [
  { code: 'en', name: 'English' },
  { code: 'ae', name: 'Arabic' },
];

// Switch language function
const switchLanguage = (langCode: string) => {
  store.toggleLocale(langCode);
};

// Current language
const currentLanguage = computed(() => 
  languageList.find(lang => lang.code === store.locale)
);
```

### Language Switcher Component
```vue
<template>
  <div class="language-switcher">
    <button
      v-for="language in languageList"
      :key="language.code"
      @click="switchLanguage(language.code)"
      :class="{ 
        'active': store.locale === language.code 
      }"
      class="lang-btn"
    >
      {{ language.name }}
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/index';

const store = useAppStore();

const languageList = [
  { code: 'en', name: 'English' },
  { code: 'ae', name: 'العربية' },
];

const switchLanguage = (langCode) => {
  store.toggleLocale(langCode);
};
</script>
```

---

## 🔄 RTL (Right-to-Left) Support

### RTL Configuration
```typescript
// App Store RTL handling
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
},

toggleRTL(payload: 'rtl' | 'ltr') {
  localStorage.setItem('rtlClass', payload);
  this.rtlClass = payload;
  document.querySelector('html')?.setAttribute('dir', payload);
}
```

### RTL-Aware Styling
```css
/* TailwindCSS RTL utilities */
.ltr:ml-4 { margin-left: 1rem; }
.rtl:mr-4 { margin-right: 1rem; }

/* Custom RTL styles */
.sidebar {
  @apply ltr:left-0 rtl:right-0;
}

.dropdown-menu {
  @apply ltr:left-0 rtl:right-0;
}

/* Flex direction for RTL */
.rtl .flex-row {
  flex-direction: row-reverse;
}

/* Text alignment */
.rtl .text-left {
  text-align: right;
}

.rtl .text-right {
  text-align: left;
}
```

### RTL-Aware Components
```vue
<template>
  <div :class="[
    'navigation',
    store.rtlClass
  ]">
    <!-- RTL-aware positioning -->
    <div :class="{
      'ltr:ml-2 rtl:mr-2': true,
      'ltr:text-left rtl:text-right': true
    }">
      {{ $t('content') }}
    </div>
  </div>
</template>

<script setup>
const store = useAppStore();

// Computed classes for RTL
const navigationClasses = computed(() => ({
  'flex-row': store.rtlClass === 'ltr',
  'flex-row-reverse': store.rtlClass === 'rtl',
}));
</script>
```

---

## 📝 Dynamic Translations

### Loading Translations Dynamically
```typescript
// Dynamic locale loading
const loadLocale = async (locale: string) => {
  try {
    const messages = await import(`@/locales/${locale}.json`);
    i18n.global.setLocaleMessage(locale, messages.default);
    return true;
  } catch (error) {
    console.error(`Failed to load locale ${locale}:`, error);
    return false;
  }
};

// Usage
const addNewLanguage = async (locale: string) => {
  const loaded = await loadLocale(locale);
  if (loaded) {
    // Add to available languages
    store.languageList.push({ 
      code: locale, 
      name: getLanguageName(locale) 
    });
  }
};
```

### Context-Aware Translations
```typescript
// Different translations based on user role
const getContextualTranslation = (key: string) => {
  const role = myDataStore.getRole();
  const contextKey = `${key}_${role.toLowerCase()}`;
  
  // Try context-specific translation first
  if (i18n.global.te(contextKey)) {
    return i18n.global.t(contextKey);
  }
  
  // Fallback to general translation
  return i18n.global.t(key);
};

// Usage
const dashboardTitle = computed(() => 
  getContextualTranslation('dashboard_title')
);
```

---

## 🔢 Number & Date Formatting

### Locale-Aware Formatting
```typescript
// Number formatting
const formatNumber = (number: number, locale?: string) => {
  const currentLocale = locale || i18n.global.locale.value;
  return new Intl.NumberFormat(currentLocale).format(number);
};

// Currency formatting
const formatCurrency = (amount: number, currency = 'USD') => {
  const locale = i18n.global.locale.value;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Date formatting
const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const locale = i18n.global.locale.value;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options })
    .format(dateObj);
};
```

### Usage in Components
```vue
<template>
  <div>
    <!-- Formatted numbers -->
    <p>{{ formatNumber(1234.56) }}</p>
    
    <!-- Formatted currency -->
    <p>{{ formatCurrency(99.99) }}</p>
    
    <!-- Formatted dates -->
    <p>{{ formatDate(new Date()) }}</p>
    
    <!-- Relative time -->
    <p>{{ $d(new Date(), 'short') }}</p>
  </div>
</template>

<script setup>
// Component setup
</script>
```

---

## 🧩 Translation Management

### Missing Translation Handling
```typescript
// Handle missing translations
i18n.global.missingHandler = (locale, key, instance, type) => {
  console.warn(`Missing translation: ${key} for locale: ${locale}`);
  
  // Return key as fallback
  return key;
};

// Fallback locale chain
i18n.global.fallbackLocale = ['en', 'ae'];
```

### Translation Validation
```typescript
// Validate all translations exist
const validateTranslations = (requiredKeys: string[]) => {
  const locale = i18n.global.locale.value;
  const missing: string[] = [];
  
  requiredKeys.forEach(key => {
    if (!i18n.global.te(key, locale)) {
      missing.push(key);
    }
  });
  
  if (missing.length > 0) {
    console.error(`Missing translations for locale ${locale}:`, missing);
  }
  
  return missing.length === 0;
};
```

---

## 🧪 Testing Internationalization

### Translation Testing
```typescript
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';

describe('Component i18n', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: { hello: 'Hello' },
      ae: { hello: 'مرحبا' },
    },
  });
  
  it('renders correct translation', () => {
    const wrapper = mount(Component, {
      global: {
        plugins: [i18n],
      },
    });
    
    expect(wrapper.text()).toContain('Hello');
  });
  
  it('switches language correctly', async () => {
    const wrapper = mount(Component, {
      global: {
        plugins: [i18n],
      },
    });
    
    i18n.global.locale = 'ae';
    await wrapper.vm.$nextTick();
    
    expect(wrapper.text()).toContain('مرحبا');
  });
});
```

---

## 📊 Performance Optimization

### Lazy Loading Translations
```typescript
// Only load required translations
const lazyLoadLocale = async (locale: string) => {
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await import(`@/locales/${locale}.json`);
    i18n.global.setLocaleMessage(locale, messages.default);
  }
};

// Use before switching locale
const switchToLocale = async (locale: string) => {
  await lazyLoadLocale(locale);
  i18n.global.locale.value = locale;
};
```

### Translation Caching
```typescript
// Cache expensive translations
const translationCache = new Map<string, string>();

const getCachedTranslation = (key: string, params?: any) => {
  const cacheKey = `${key}:${JSON.stringify(params)}:${i18n.global.locale.value}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const translation = i18n.global.t(key, params);
  translationCache.set(cacheKey, translation);
  
  return translation;
};
```

---

*This internationalization documentation provides comprehensive guidance for implementing multi-language support in Cepro.ai. For specific translation keys and usage examples, refer to the locale files and component implementations.*
