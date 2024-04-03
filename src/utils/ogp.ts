import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import me from "../assets/images/meta/me.png";

const { font, icon } = await (async () => {
  if (import.meta.env.PROD) {
    const font = await readFile(
      join(
        fileURLToPath(import.meta.url),
        "../../../src/assets/fonts/NotoSansJP-SemiBold.ttf",
      ),
    );
    const icon = new Uint8Array(
      await readFile(join(fileURLToPath(import.meta.url), "../../", me.src)),
    ).buffer;

    return {
      font,
      icon,
    };
  }

  return {
    font: null,
    icon: null,
  };
})();

export async function generateOgImage(title: string, tags: string[]) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          padding: "60px 80px",
          width: "100%",
          height: "100%",
          backgroundImage: "linear-gradient(120deg, #075985, #1f2937 60%)",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 20,
              },
              children: [
                {
                  type: "h2",
                  props: {
                    style: {
                      display: "flex",
                      width: "100%",
                      fontSize: "60px",
                      color: "#f3f4f6",
                      textOverflow: "ellipsis",
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      gap: 20,
                    },
                    children: tags.map((tag) => ({
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#f5f5f4",
                          background: "#64748b",
                          padding: "8px 24px",
                          borderRadius: 48,
                        },
                        children: {
                          type: "span",
                          props: {
                            children: tag,
                            style: {
                              fontSize: 32,
                            },
                          },
                        },
                      },
                    })),
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                fontSize: "40px",
                gap: 20,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    },
                    children: [
                      {
                        type: "img",
                        props: {
                          src: icon,
                          width: 64,
                          height: 64,
                          style: {
                            borderRadius: "100%",
                          },
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            display: "flex",
                            color: "#3498db",
                          },
                          children: "hiroppy",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "NotoSansJP",
          data: font as Buffer,
        },
      ],
    },
  );
  const res = await sharp(Buffer.from(svg)).png().toBuffer();

  return res;
}
