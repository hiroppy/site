import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://hiroppy.me/",

  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
    mdx(),
  ],

  markdown: {
    shikiConfig: {
      theme: "nord",
    },
  },

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
});
