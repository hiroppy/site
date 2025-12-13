"use cache";

import { MdLabelOutline } from "react-icons/md";
import { Card } from "../../../../components/Card";
import { getAllTags } from "../../../../mdx/contentLoader";
import { BlogTag } from "./BlogTag";

type Props = {
  currentTag?: string;
};

export async function TagsBox({ currentTag }: Props) {
  const allTags = await getAllTags();

  return (
    <Card>
      <div className="p-4">
        <p className="text-text-main flex items-center">
          <MdLabelOutline
            className="mr-2"
            size={20}
            aria-hidden="true"
            focusable="false"
          />
          Tags
        </p>
        <div className="scrollbar-hide mt-4 overflow-x-auto md:overflow-visible">
          <div className="flex gap-2 pb-2 md:flex-wrap">
            {allTags.map((tag) => (
              <BlogTag
                key={tag}
                tag={tag}
                className="shrink-0 md:shrink"
                active={currentTag === tag}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
