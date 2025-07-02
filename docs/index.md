---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Cepro.ai Documentation"
  text: "Frontend Application Guide"
  tagline: "Comprehensive documentation for the Vue.js-powered Cepro.ai dashboard"
  actions:
    - theme: brand
      text: Get Started
      link: /09-development-guide
    - theme: alt
      text: View Architecture
      link: /02-architecture

features:
  - icon: ⚡
    title: Modern Vue.js Stack
    details: Built with Vue 3, TypeScript, Vite, and TailwindCSS for optimal performance and developer experience.
  
  - icon: 🎨
    title: Component Library
    details: Comprehensive reusable components with consistent design patterns and theming support.
  
  - icon: 🔧
    title: State Management
    details: Robust state management with Pinia stores for scalable application architecture.
  
  - icon: 🌐
    title: API Integration
    details: Complete API integration patterns with Axios, authentication, and error handling.
  
  - icon: 🎯
    title: Best Practices
    details: Industry-standard coding practices, testing patterns, and development workflows.
  
  - icon: 🚀
    title: Production Ready
    details: Deployment guides, performance optimization, and scaling strategies for production environments.
---

## Quick Navigation

<div class="tip custom-block" style="padding-top: 8px">

**For Developers Getting Started:**
- 📖 [Application Overview](/01-application-overview) - Understand the application's purpose and features
- 🛠️ [Development Setup](/09-development-guide) - Get your development environment ready
- 🏗️ [Architecture Guide](/02-architecture) - Learn about the technical structure

</div>

<div class="info custom-block" style="padding-top: 8px">

**For Component Development:**
- 🧩 [Component Guide](/03-components) - Detailed component documentation
- 🎨 [Theming System](/08-theming) - Learn about styling and themes
- 🔄 [State Management](/04-state-management) - Understanding Pinia stores

</div>

<div class="warning custom-block" style="padding-top: 8px">

**For Integration & Deployment:**
- 🔌 [API Integration](/06-api-integration) - Connect with backend services
- 🌍 [Internationalization](/07-internationalization) - Multi-language support
- 🚀 [Deployment Guide](/11-deployment) - Production deployment strategies

</div>

## Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Vue.js** | Frontend Framework | 3.x |
| **TypeScript** | Type Safety | Latest |
| **Vite** | Build Tool | 5.x |
| **TailwindCSS** | Styling Framework | 3.x |
| **Pinia** | State Management | Latest |
| **Vue Router** | Client-side Routing | 4.x |
| **Axios** | HTTP Client | Latest |
| **Vue I18n** | Internationalization | 9.x |

## Project Structure

```
cepro/
├── src/
│   ├── components/     # Reusable components
│   ├── views/         # Page components
│   ├── stores/        # Pinia state stores
│   ├── router/        # Vue Router configuration
│   ├── services/      # API and external services
│   ├── composables/   # Vue composition functions
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
├── docs/              # This documentation
├── public/            # Public assets
└── ...config files
```

## Contributing

This documentation is maintained alongside the codebase. To contribute:

1. Update the relevant documentation files in the `/docs` folder
2. Follow the existing documentation structure and style
3. Test your changes locally with `npm run docs:dev`
4. Submit a pull request with your improvements

---

*Last updated: {{ new Date().toLocaleDateString() }}*
