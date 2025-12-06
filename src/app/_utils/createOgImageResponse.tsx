import { ImageResponse } from "next/og";
import { OgBaseTemplate, OgTitleSection } from "../_components/OgTemplate";
import { BLOG_SITE_TITLE, SITE_TITLE } from "../_constants";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export async function createOgImageResponse(
  title: string,
  pageType: string,
  description?: string,
  tags?: string[],
) {
  try {
    const template = tags ? (
      <OgBaseTemplate
        headerText={BLOG_SITE_TITLE}
        titleContent={<OgTitleSection title={title} tags={tags} />}
        pageType="Blog Post"
      />
    ) : (
      <OgBaseTemplate
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
          data: await loadGoogleFont("Noto+Sans+JP"),
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

async function loadGoogleFont(font: string) {
  "use cache";

  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);

    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
