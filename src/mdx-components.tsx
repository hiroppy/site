import type { MDXComponents } from "mdx/types";
import { Image } from "./app/_components/Image";
import { Alert } from "./mdx/components/Alert";
import CodeGroup from "./mdx/components/CodeGroup";
import { GoogleSlidesCard } from "./mdx/components/GoogleSlidesCard";
import { OG } from "./mdx/components/OG";
import { TwitterCard } from "./mdx/components/TwitterCard";
import { TwoColumn } from "./mdx/components/TwoColumn";
import { YoutubeCard } from "./mdx/components/YoutubeCard";

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
