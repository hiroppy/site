import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { remarkCodeGroups } from "./src/utils/remark-code-groups";
import { remarkAlerts } from "./src/utils/remark-alerts";

const adapter =
  process.env.NODE_ENV !== "test"
    ? (await import("@astrojs/vercel")).default()
    : (await import("@astrojs/node")).default({ mode: "standalone" });

// https://astro.build/config
export default defineConfig({
  site: "https://hiroppy.me/",

  markdown: {
    remarkPlugins: [remarkCodeGroups, remarkAlerts],
  },

  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
    astroExpressiveCode({
      themes: ["nord", "github-light-default"],
      styleOverrides: {
        borderRadius: "0.375rem",
        borderColor: "rgb(84 88 100)",
      },
      defaultProps: {
        overridesByLang: {
          "bash,sh,shell": {
            frame: "none",
          },
        },
      },
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
    }),
    mdx({
      remarkPlugins: [remarkCodeGroups, remarkAlerts],
    }),
    icon(),
  ],

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    remotePatterns: [
      {
        protocol: "https",
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter,
});
