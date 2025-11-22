import { defineConfig } from "vitepress";

const gettingStarted = [
  { text: "Installation", link: "/docs/installation" },
  { text: "Modules", link: "/docs/modules" },
  { text: "Providers", link: "/docs/providers" },
  { text: "Controllers", link: "/docs/controllers" },
  { text: "Hooks", link: "/docs/hooks" },
  { text: "Application", link: "/docs/application" },
];

const compatibility = [
  { text: "Installers", link: "/docs/installers" },
  { text: "Adapters", link: "/docs/adapters" },
];

const architecture = [
  { text: "Dependency Inversion Principle", link: "/docs/dip" },
];

export default defineConfig({
  lang: "en-US",
  title: "Stratify",
  description: "Architectural Framework for Fastify",
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  themeConfig: {
    nav: [
      { text: "Getting Started", link: "/docs/installation",  },
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: gettingStarted,
      },
      {
        text: "Fastify Compatibility",
        items: compatibility,
      },
      {
        text: "Architecture Patterns",
        items: architecture,
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/stratifyjs" },
    ],
    outline: "deep",
  },
});
