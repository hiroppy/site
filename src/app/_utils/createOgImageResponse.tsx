import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OgBaseTemplate, OgTitleSection } from "../_components/OgTemplate";
import { BLOG_SITE_TITLE, SITE_TITLE } from "./constants";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

async function loadAssets() {
  if (process.env.NODE_ENV !== "development") {
    const [font, iconData] = await Promise.all([
      readFile(join(process.cwd(), "public/fonts/NotoSansJP-SemiBold.ttf")),
      readFile(join(process.cwd(), "public/images/meta/me.png")),
    ]);

    return {
      font,
      iconBase64: iconData.toString("base64"),
    };
  }

  return {
    font: null,
    iconBase64: null,
  };
}

const { font, iconBase64 } = await loadAssets();

export async function createOgImageResponse(
  title: string,
  pageType: string,
  description?: string,
  tags?: string[],
) {
  try {
    const template = tags ? (
      <OgBaseTemplate
        iconBase64={iconBase64!}
        headerText={BLOG_SITE_TITLE}
        titleContent={<OgTitleSection title={title} tags={tags} />}
        pageType="Blog Post"
      />
    ) : (
      <OgBaseTemplate
        iconBase64={iconBase64!}
        headerText={SITE_TITLE}
        titleContent={
          <OgTitleSection title={title} description={description} />
        }
        pageType={pageType}
      />
    );

    return new ImageResponse(template, {
      ...size,
      fonts: [
        {
          name: "NotoSansJP",
          data: font as Buffer,
          style: "normal",
        },
      ],
    });
  } catch (error) {
    console.error("Failed to generate OG image:", error);
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#fdfbf7",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: 48, color: "#333" }}>hiroppy.me</h1>
      </div>,
      size,
    );
  }
}
