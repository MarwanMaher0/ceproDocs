// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // You can enhance the app instance here
    // For example, register global components
  },
};
