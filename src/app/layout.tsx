import { GoogleAnalytics } from "@next/third-parties/google";
import meta from "hiroppy/generated/meta.json";
import type { Metadata } from "next";
import { Inter, Zen_Kaku_Gothic_New } from "next/font/google";
import { SITE_DESCRIPTION, SITE_TITLE } from "./_constants";
import "./_styles/globals.css";
import { cn } from "./_utils/cn";

const inter = Inter({
  subsets: ["latin"],
  style: ["italic", "normal"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  preload: true,
  variable: "--font-zen-kaku-gothic-new",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? meta.site.personal),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta property="theme-color" content="#3498db" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@about_hiroppy" />
        <meta
          name="google-site-verification"
          content="5oxyYILHYb_TUbxn5n1vZlDDEj2K8BTQhwMqJnEX8CA"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//api.iconify.design" />
        <link rel="preconnect" href="//api.iconify.design" />
        <link rel="author" href="http://www.hatena.ne.jp/about_hiroppy/" />
      </head>
      <body
        className={cn(
          "bg-bg min-h-screen",
          zenKakuGothicNew.className,
          inter.className,
        )}
      >
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
