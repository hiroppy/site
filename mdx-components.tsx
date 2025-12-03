import type { MDXComponents } from "mdx/types";
import { Image } from "./src/app/_components/Image";
import { Alert } from "./src/mdx/components/Alert";
import CodeGroup from "./src/mdx/components/CodeGroup";
import { GoogleSlidesCard } from "./src/mdx/components/GoogleSlidesCard";
import { OG } from "./src/mdx/components/OG";
import { TwitterCard } from "./src/mdx/components/TwitterCard";
import { TwoColumn } from "./src/mdx/components/TwoColumn";
import { YoutubeCard } from "./src/mdx/components/YoutubeCard";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Alert,
    // @ts-expect-error async
    OG: OG,
    CodeGroup,
    TwitterCard,
    YoutubeCard,
    GoogleSlidesCard,
    TwoColumn,
    Image,
    ...components,
  };
}
