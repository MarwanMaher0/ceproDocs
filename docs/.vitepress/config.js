import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Cepro.ai Documentation',
  description: 'Comprehensive documentation for the Cepro.ai frontend application',

  // Clean URLs
  cleanUrls: true,

  // Theme configuration
  themeConfig: {
    // Site title and logo
    siteTitle: 'Cepro.ai Docs',

    // Navigation menu
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get Started', link: '/09-development-guide' },
      { text: 'Components', link: '/03-components' },
      { text: 'API', link: '/06-api-integration' },
    ],

    // Sidebar navigation
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/01-application-overview' },
          { text: 'Development Setup', link: '/09-development-guide' },
          { text: 'Best Practices', link: '/10-best-practices' },
        ],
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Application Architecture', link: '/02-architecture' },
          { text: 'State Management', link: '/04-state-management' },
          { text: 'Routing & Navigation', link: '/05-routing' },
        ],
      },
      {
        text: 'Components & UI',
        items: [
          { text: 'Component Guide', link: '/03-components' },
          { text: 'Theming & Styling', link: '/08-theming' },
          { text: 'Internationalization', link: '/07-internationalization' },
        ],
      },
      {
        text: 'Integration',
        items: [{ text: 'API Integration', link: '/06-api-integration' }],
      },
      {
        text: 'Deployment',
        items: [{ text: 'Deployment Guide', link: '/11-deployment' }],
      },
    ],

    // Social links
    socialLinks: [{ icon: 'github', link: 'https://github.com/your-org/cepro-frontend' }],

    // Footer
    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2025 Cepro.ai',
    },

    // Search
    search: {
      provider: 'local',
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/your-org/cepro-frontend/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    // Last updated
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },

  // Markdown configuration
  markdown: {
    theme: 'github-dark',
    lineNumbers: true,
  },

  // Head configuration
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'description', content: 'Comprehensive documentation for the Cepro.ai frontend application built with Vue.js' }],
  ],
});
