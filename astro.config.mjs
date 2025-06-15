import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

const adapter =
  process.env.NODE_ENV !== "test"
    ? (await import("@astrojs/vercel")).default()
    : (await import("@astrojs/node")).default({ mode: "standalone" });

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
    icon(),
  ],

  markdown: {
    shikiConfig: {
      themes: {
        light: "one-light",
        dark: "nord",
      },
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
    server: {
      fs: {
        strict: false,
      },
    },
  },

  adapter,
});
