import meta from "hiroppy/generated/meta.json";
import { Button } from "../../../../../_components/Button";
import { Icon } from "../../../../../_components/Icon";
import { Hatena } from "../../../../../_components/icons/Hatena";
import { SITE_TITLE } from "../../../../../_constants";

type Props = {
  id: string;
  title: string;
};

export function ShareButtons({ id, title }: Props) {
  const url = `${meta.site.blog}posts/${id}`;
  const sharedTitle = `${title} - ${SITE_TITLE}`;
  const twitter = `https://twitter.com/share?url=${url}&text=${sharedTitle}&related=about_hiroppy`;
  const twitterFollow =
    "https://twitter.com/intent/follow?screen_name=about_hiroppy";
  const hatena = `https://b.hatena.ne.jp/entry/panel/?url=${url}&title=${sharedTitle}#bbutton`;

  const shareButtonClass =
    "flex items-center gap-2 text-gray-600 hover:text-blue-600";

  return (
    <div className="share-buttons flex flex-row items-center justify-center gap-2">
      <Button
        href={twitter}
        variant="ghost"
        className={shareButtonClass}
        ariaLabel="Tweet"
      >
        <Icon icon="mdi:twitter" width="20" height="20" />
        <span>Tweet</span>
      </Button>
      <Button
        href={twitterFollow}
        variant="ghost"
        className={shareButtonClass}
        ariaLabel="Follow on Twitter"
      >
        <Icon icon="mdi:twitter" width="20" height="20" />
        <span>Follow</span>
      </Button>
      <Button
        href={hatena}
        variant="ghost"
        className={shareButtonClass}
        ariaLabel="Link for hatena"
      >
        <Hatena className="h-4 w-4" />
        <span>Bookmark</span>
      </Button>
    </div>
  );
}
