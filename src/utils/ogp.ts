import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import me from "../assets/images/meta/me.png";

const font = await readFile(
  join(
    fileURLToPath(import.meta.url),
    "../../../src/assets/fonts/Noto_Sans_JP/static/NotoSansJP-Medium.ttf",
  ),
);
const icon = new Uint8Array(
  await readFile(join(fileURLToPath(import.meta.url), "../../", me.src)),
).buffer;

export async function generateOgImage(title: string, tags: string[]) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          padding: "40px 60px",
          width: "100%",
          height: "100%",
          backgroundImage: "linear-gradient(120deg, #075985, #1f2937 60%)",
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
                justifyContent: "space-between",
                alignItems: "flex-end",
                fontSize: "40px",
                width: "100%",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          },
                          children: tags.map((tag) => ({
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                color: "#e5e7eb",
                              },
                              children: `# ${tag}`,
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
                      justifyContent: "space-between",
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
          data: font,
          style: "normal",
        },
      ],
    },
  );
  const res = await sharp(Buffer.from(svg)).png().toBuffer();

  return res;
}
