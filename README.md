# Cepro.ai Documentation

This repository contains the comprehensive documentation for the Cepro.ai frontend application, built with VitePress.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run docs:dev
   ```

3. **Build for production:**
   ```bash
   npm run docs:build
   ```

4. **Preview production build:**
   ```bash
   npm run docs:preview
   ```

## 📁 Project Structure

```
ceproDocs/
├── package.json                 # Project configuration and dependencies
├── docs/                       # Documentation source files
│   ├── .vitepress/            # VitePress configuration
│   │   ├── config.js          # Main VitePress config
│   │   └── theme/             # Custom theme
│   │       ├── index.js       # Theme entry point
│   │       └── custom.css     # Custom styles
│   ├── index.md               # Homepage
│   ├── 01-application-overview.md
│   ├── 02-architecture.md
│   ├── 03-components.md
│   ├── 04-state-management.md
│   ├── 05-routing.md
│   ├── 06-api-integration.md
│   ├── 07-internationalization.md
│   ├── 08-theming.md
│   ├── 09-development-guide.md
│   ├── 10-best-practices.md
│   ├── 11-deployment.md
│   └── README_DOCS.md         # Documentation about the docs
└── README.md                   # This file
```

## 🌐 Accessing the Documentation

Once the development server is running, you can access the documentation at:
- **Local:** http://localhost:5176/
- **Network:** Use `--host` flag to expose to network

## 📝 Adding New Content

1. Create new `.md` files in the `docs/` directory
2. Update the sidebar configuration in `docs/.vitepress/config.js`
3. The site will automatically reload with your changes

## 🎨 Customization

- **Styling:** Edit `docs/.vitepress/theme/custom.css`
- **Theme:** Modify `docs/.vitepress/theme/index.js`
- **Configuration:** Update `docs/.vitepress/config.js`

## 📖 Documentation Sections

The documentation is organized into the following sections:

1. **Application Overview** - Introduction and feature overview
2. **Architecture** - Technical architecture and design patterns
3. **Components** - UI component library and usage
4. **State Management** - Pinia stores and state patterns
5. **Routing** - Vue Router configuration and navigation
6. **API Integration** - Backend integration and data handling
7. **Internationalization** - Multi-language support
8. **Theming** - Styling and theme system
9. **Development Guide** - Setup and development workflow
10. **Best Practices** - Coding standards and conventions
11. **Deployment** - Production deployment and CI/CD

## 🛠️ Built With

- [VitePress](https://vitepress.dev/) - Static Site Generator
- [Vue.js](https://vuejs.org/) - Frontend Framework
- [Vite](https://vitejs.dev/) - Build Tool

## 📄 License

MIT
