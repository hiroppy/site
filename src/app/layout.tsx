import { GoogleAnalytics } from "@next/third-parties/google";
import meta from "hiroppy/generated/meta.json";
import type { Metadata } from "next";
import { Inter, Zen_Kaku_Gothic_New } from "next/font/google";
import "./_styles/globals.css";
import { cn } from "./_utils/cn";
import { SITE_DESCRIPTION, SITE_TITLE } from "./_utils/constants";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-zen-kaku-gothic-new",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(meta.site.personal),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={cn(zenKakuGothicNew.variable, inter.variable)}>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta
          name="google-site-verification"
          content="5oxyYILHYb_TUbxn5n1vZlDDEj2K8BTQhwMqJnEX8CA"
        />
        <meta property="theme-color" content="#3498db" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@about_hiroppy" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//api.github.com" />
        <link rel="preconnect" href="//api.github.com" />
        <link rel="dns-prefetch" href="//b.hatena.ne.jp" />
        <link rel="preconnect" href="//b.hatena.ne.jp" />
        <link rel="author" href="http://www.hatena.ne.jp/about_hiroppy/" />
      </head>
      <body className="bg-bg min-h-screen">{children}</body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-FD7632999P" />
      )}
    </html>
  );
}
