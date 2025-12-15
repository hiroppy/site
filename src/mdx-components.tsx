import type { MDXComponents } from "mdx/types";
import { Image, type Props as ImageProps } from "./components/Image";
import { Link } from "./components/Link";
import { Alert } from "./mdx/components/Alert";
import { CodeGroup } from "./mdx/components/CodeGroup";
import { GoogleSlidesCard } from "./mdx/components/GoogleSlidesCard";
import { OG } from "./mdx/components/OG";
import { TwitterCard } from "./mdx/components/TwitterCard";
import { TwoColumn } from "./mdx/components/TwoColumn";
import { YoutubeCard } from "./mdx/components/YoutubeCard";

export function useMDXComponents(components: MDXComponents) {
  return {
    img: MDImage,
    a: Link,
    Alert,
    OG,
    CodeGroup,
    TwitterCard,
    YoutubeCard,
    GoogleSlidesCard,
    TwoColumn,
    Image: MDImage,
    ...components,
  };
}

function MDImage(props: ImageProps) {
  return <Image {...props} unoptimized />;
}
