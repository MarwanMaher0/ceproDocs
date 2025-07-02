# Cepro.ai Frontend Documentation

This directory contains the comprehensive documentation for the Cepro.ai frontend application, built with VitePress for an optimal documentation experience.

## 📁 Documentation Structure

```
docs/
├── .vitepress/              # VitePress configuration
│   ├── config.js           # Main configuration file
│   └── theme/              # Custom theme
│       ├── index.js        # Theme entry point
│       └── custom.css      # Custom styling
├── index.md                # Homepage
├── 01-application-overview.md
├── 02-architecture.md
├── 03-components.md
├── 04-state-management.md
├── 05-routing.md
├── 06-api-integration.md
├── 07-internationalization.md
├── 08-theming.md
├── 09-development-guide.md
├── 10-best-practices.md
└── 11-deployment.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- VitePress installed (automatically handled by package.json)

### Running the Documentation

```bash
# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:serve
```

## 📖 Available Documentation Sections

| Section | Description |
|---------|-------------|
| **Application Overview** | High-level overview, features, and business context |
| **Architecture** | Technical architecture and folder structure |
| **Components** | Detailed component documentation and patterns |
| **State Management** | Pinia stores and state management patterns |
| **Routing** | Vue Router configuration and navigation |
| **API Integration** | Axios setup and API integration patterns |
| **Internationalization** | Multi-language support with Vue I18n |
| **Theming** | TailwindCSS and dynamic theming system |
| **Development Guide** | Setup, workflow, and development practices |
| **Best Practices** | Code standards, conventions, and guidelines |
| **Deployment** | Production deployment and DevOps strategies |

## 🎨 Features

- **Clean, Modern UI**: Built with VitePress default theme with custom styling
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing
- **Search Functionality**: Full-text search across all documentation
- **Navigation**: Structured sidebar navigation for easy browsing
- **Code Highlighting**: Syntax highlighting for multiple languages
- **Interactive Elements**: Enhanced with custom components and styling

## 🔧 Configuration

The documentation is configured through `.vitepress/config.js` with the following features:

- **Clean URLs**: SEO-friendly URL structure
- **Custom Navigation**: Organized menu structure
- **Social Links**: GitHub integration
- **Search**: Local search functionality
- **Edit Links**: Direct GitHub editing capability
- **Last Updated**: Automatic timestamp tracking

## 📝 Writing Documentation

### Markdown Features

The documentation supports enhanced Markdown with:

- Code blocks with syntax highlighting
- Custom containers (tip, warning, info, danger)
- Tables with enhanced styling
- Image optimization
- Internal linking

### Code Examples

```vue
<!-- Example Vue component -->
<template>
  <div class="component">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>
```

### Custom Containers

```markdown
::: tip Development Tip
This is a helpful tip for developers.
:::

::: warning Important
This is an important warning message.
:::

::: danger Breaking Change
This indicates a breaking change.
:::
```

## 🛠️ Customization

### Theme Customization
- Custom CSS variables in `.vitepress/theme/custom.css`
- Enhanced component styling
- Responsive design improvements

### Configuration Updates
- Modify `.vitepress/config.js` for site-wide settings
- Update navigation structure
- Add new sections or modify existing ones

## 📱 Mobile Optimization

The documentation is fully responsive with:
- Mobile-friendly navigation
- Optimized text sizing
- Touch-friendly interactive elements
- Collapsible sidebar

## 🔍 Search

The documentation includes local search functionality that indexes:
- All page content
- Headings and subheadings
- Code blocks
- Custom containers

## 📈 Analytics & Monitoring

To add analytics:
1. Update the `head` configuration in `.vitepress/config.js`
2. Add tracking scripts
3. Configure monitoring tools

## 🤝 Contributing

To contribute to the documentation:

1. **Edit existing pages**: Update the relevant `.md` files
2. **Add new sections**: Create new markdown files and update the sidebar configuration
3. **Improve styling**: Modify `.vitepress/theme/custom.css`
4. **Test changes**: Run `npm run docs:dev` to preview locally
5. **Build verification**: Run `npm run docs:build` to ensure production build works

## 🚀 Deployment

The documentation can be deployed to various platforms:

### Vercel
```bash
npm run docs:build
# Deploy the docs/.vitepress/dist folder
```

### Netlify
```bash
# Build command: npm run docs:build
# Publish directory: docs/.vitepress/dist
```

### GitHub Pages
```bash
# Use GitHub Actions to build and deploy
# Base path configuration may be needed
```

### Custom Server
```bash
npm run docs:build
# Serve the docs/.vitepress/dist folder with any static file server
```

## 📄 License

This documentation is part of the Cepro.ai frontend application and follows the same licensing terms.

---

**Last Updated**: {{ new Date().toLocaleDateString() }}
**VitePress Version**: 1.6.3
