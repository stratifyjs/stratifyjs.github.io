import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "nav-bar-title-before": () =>
        h("span", { class: "brand-mark", "aria-hidden": "true" }),
      "home-hero-info-before": () =>
        h("div", { class: "hero-kicker" }, "Fastify, structured"),
    }),
};
