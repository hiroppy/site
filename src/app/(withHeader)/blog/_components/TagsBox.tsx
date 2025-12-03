import { Card } from "../../../_components/Card";
import { Icon } from "../../../_components/Icon";
import { BlogTag } from "./BlogTag";

type Props = {
  tags: string[];
  currentTag?: string;
};

export function TagsBox({ tags, currentTag }: Props) {
  return (
    <Card>
      <div className="p-4">
        <p className="text-text-main flex items-center">
          <Icon icon="noto:label" className="mr-2" width="20" height="20" />
          Tags
        </p>
        <div className="scrollbar-hide mt-4 overflow-x-auto md:overflow-visible">
          <div className="flex gap-2 pb-2 md:flex-wrap">
            {tags.map((tag) => (
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
