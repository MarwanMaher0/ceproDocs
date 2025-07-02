import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Cepro.ai Documentation",
  description:
    "Comprehensive documentation for the Cepro.ai frontend application",

  // Clean URLs
  cleanUrls: true,

  // Theme configuration
  themeConfig: {
    // Site title and logo with enhanced branding
    siteTitle: "Cepro.ai Docs",
    logo: {
      light: "/logo-dark.svg",
      dark: "/logo-light.svg ",
    },

    // Enhanced navigation menu with dark mode support
    nav: [
      { text: "🏠 Home", link: "/" },
      { text: "🚀 Get Started", link: "/09-development-guide" },
      { text: "🧩 Components", link: "/03-components" },
      { text: "🔌 API", link: "/06-api-integration" },
      {
        text: "📚 More",
        items: [
          { text: "🎨 Theming", link: "/08-theming" },
          { text: "🌍 i18n", link: "/07-internationalization" },
          { text: "📦 Deployment", link: "/11-deployment" },
          { text: "✨ Best Practices", link: "/10-best-practices" },
        ],
      },
    ],

    // Enable dark mode toggle
    darkModeSwitchLabel: "Toggle dark mode",
    sidebarMenuLabel: "Menu",
    returnToTopLabel: "Return to top",
    darkModeSwitchTitle: "Switch to dark theme",
    lightModeSwitchTitle: "Switch to light theme",

    // Enhanced sidebar navigation with better organization
    sidebar: [
      {
        text: "🚀 Getting Started",
        collapsed: false,
        items: [
          { text: "📋 Overview", link: "/01-application-overview" },
          { text: "⚙️ Development Setup", link: "/09-development-guide" },
          { text: "✨ Best Practices", link: "/10-best-practices" },
        ],
      },
      {
        text: "🏗️ Architecture",
        collapsed: false,
        items: [
          { text: "🏛️ Application Architecture", link: "/02-architecture" },
          { text: "🗃️ State Management", link: "/04-state-management" },
          { text: "🛣️ Routing & Navigation", link: "/05-routing" },
        ],
      },
      {
        text: "🎨 Components & UI",
        collapsed: false,
        items: [
          { text: "🧩 Component Guide", link: "/03-components" },
          { text: "🎨 Theming & Styling", link: "/08-theming" },
          { text: "🌍 Internationalization", link: "/07-internationalization" },
        ],
      },
      {
        text: "🔌 Integration",
        collapsed: false,
        items: [{ text: "🔌 API Integration", link: "/06-api-integration" }],
      },
      {
        text: "🚀 Deployment",
        collapsed: false,
        items: [{ text: "📦 Deployment Guide", link: "/11-deployment" }],
      },
    ],

    // Enhanced social links
    socialLinks: [
      { icon: "github", link: "https://github.com/your-org/cepro-frontend" },
      { icon: "discord", link: "https://discord.gg/cepro" },
      { icon: "twitter", link: "https://twitter.com/ceproai" },
    ],

    // Enhanced footer
    footer: {
      message: "Built with ❤️ using VitePress and modern web technologies",
      copyright:
        "Copyright © 2025 Cepro.ai - Empowering the future of web development",
    },

    // Enhanced search configuration
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "🔍 Search docs...",
                buttonAriaLabel: "Search documentation",
              },
              modal: {
                displayDetails: "Display detailed list",
                resetButtonTitle: "Reset search",
                backButtonTitle: "Close search",
                noResultsText: "No results found",
                footer: {
                  selectText: "to select",
                  selectKeyAriaLabel: "enter",
                  navigateText: "to navigate",
                  navigateUpKeyAriaLabel: "up arrow",
                  navigateDownKeyAriaLabel: "down arrow",
                  closeText: "to close",
                  closeKeyAriaLabel: "escape",
                },
              },
            },
          },
        },
      },
    },

    // Edit link
    editLink: {
      pattern:
        "https://github.com/your-org/cepro-frontend/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    // Last updated
    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },
  },

  // Markdown configuration
  markdown: {
    theme: "github-dark",
    lineNumbers: true,
  },

  // Head configuration
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
        rel: "stylesheet",
      },
    ],
    [
      "meta",
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],
    [
      "meta",
      {
        name: "description",
        content:
          "Comprehensive documentation for the Cepro.ai frontend application built with Vue.js",
      },
    ],
    ["meta", { name: "theme-color", content: "#00d4aa" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Cepro.ai Documentation" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Comprehensive documentation for the Cepro.ai frontend application",
      },
    ],
    ["meta", { property: "og:image", content: "/hero-image.svg" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ],
});
