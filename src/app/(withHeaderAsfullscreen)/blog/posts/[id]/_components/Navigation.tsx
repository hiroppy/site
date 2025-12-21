"use cache";

import {
  getAdjacentBlogPosts,
  getRelatedBlogPosts,
} from "../../../../../../mdx/contentLoader";
import { AdjacentPostCards } from "./AdjacentPostCards";
import { RelatedPostCards } from "./RelatedPostCards";

type Props = {
  id: string;
  tags: string;
};

export async function Navigation({ id, tags }: Props) {
  const { prev, next } = await getAdjacentBlogPosts(id);
  const relatedPosts = await getRelatedBlogPosts(id, tags, 2);

  return (
    <>
      <AdjacentPostCards prev={prev} next={next} />
      <RelatedPostCards posts={relatedPosts} />
    </>
  );
}
