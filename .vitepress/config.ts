import { defineConfig } from "vitepress";

const guide = [
  { text: "Installation", link: "/docs/installation" },
  { text: "Create a Module", link: "/docs/create-module" },
  { text: "Bootstrapping", link: "/docs/bootstrapping" },
  { text: "Providers (DI)", link: "/docs/providers-di" },
  { text: "Controllers (Routes)", link: "/docs/controllers-routes" },
  { text: "Hooks", link: "/docs/hooks" },
  { text: "Installers", link: "/docs/installers" },
  { text: "Adapters", link: "/docs/adapters" },
  { text: "Architectures Based on DIP", link: "/docs/architectures-based-on-dip" },
];

export default defineConfig({
  lang: "en-US",
  title: "Home",
  description: "Architectural Framework for Fastify",
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/docs/installation" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: guide,
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/stratifyjs" },
    ],
    outline: "deep",
  },
});
