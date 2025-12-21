import { ImageResponse } from "next/og";
import { OgBaseTemplate } from "../components/og/OgBaseTemplate";
import { OgTitleSection } from "../components/og/OgTitleSection";
import { BLOG_SITE_TITLE, SITE_TITLE } from "../constants";

export const ogSize = {
  width: 1200,
  height: 630,
};
export const ogContentType = "image/png";

export async function createOgImageResponse(
  title: string,
  description?: string,
  tags?: string[],
) {
  const avatar = Buffer.from(await loadAvatarImage()).toString("base64");

  try {
    const template = tags ? (
      <OgBaseTemplate
        avatar={avatar}
        headerText={BLOG_SITE_TITLE}
        titleContent={<OgTitleSection title={title} tags={tags} />}
      />
    ) : (
      <OgBaseTemplate
        avatar={avatar}
        headerText={SITE_TITLE}
        titleContent={
          <OgTitleSection title={title} description={description} />
        }
      />
    );

    return new ImageResponse(template, {
      ...ogSize,
      fonts: [
        {
          name: "Zen Kaku Gothic New",
          data: await loadGoogleFont("Zen+Kaku+Gothic+New:wght@400"),
          style: "normal",
          weight: 400,
        },
        {
          name: "Zen Kaku Gothic New",
          data: await loadGoogleFont("Zen+Kaku+Gothic+New:wght@500"),
          style: "normal",
          weight: 500,
        },
        {
          name: "Zen Kaku Gothic New",
          data: await loadGoogleFont("Zen+Kaku+Gothic+New:wght@700"),
          style: "normal",
          weight: 700,
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
      ogSize,
    );
  }
}

async function loadAvatarImage() {
  "use cache";

  // webpだと読み込めないため、jpgで取得する
  const url = "https://hiroppy.me/images/meta/ogp.jpg";
  const meBuffer = await fetch(url, {
    cache: "force-cache",
  }).then((res) => res.arrayBuffer());

  return meBuffer;
}

async function loadGoogleFont(font: string) {
  "use cache";

  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const res = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (res) {
    const response = await fetch(res[1]);

    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
