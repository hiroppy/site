import { FaXTwitter } from "react-icons/fa6";
import { SiHatenabookmark } from "react-icons/si";
import { Link } from "../../../../../../components/Link";
import { BLOG_URL, SITE_TITLE } from "../../../../../../constants";

type Props = {
  id: string;
  title: string;
};

export function ShareButtons({ id, title }: Props) {
  const url = `${BLOG_URL}posts/${id}`;
  const sharedTitle = `${title} - ${SITE_TITLE}`;
  const items = [
    {
      name: "Post",
      href: `https://twitter.com/share?url=${url}&text=${sharedTitle}&related=about_hiroppy`,
      ariaLabel: "Share on X",
      icon: <FaXTwitter size={20} aria-hidden="true" focusable="false" />,
    },
    {
      name: "Follow",
      href: "https://twitter.com/intent/follow?screen_name=about_hiroppy",
      ariaLabel: "Follow on Twitter",
      icon: <FaXTwitter size={20} aria-hidden="true" focusable="false" />,
    },
    {
      name: "Bookmark",
      href: `https://b.hatena.ne.jp/entry/panel/?url=${url}&title=${sharedTitle}#bbutton`,
      ariaLabel: "Bookmark on Hatena",
      icon: <SiHatenabookmark size={20} aria-hidden="true" focusable="false" />,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-6">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          unstyled
          className="flex items-center gap-2 hover:opacity-70 text-text-main text-sm font-medium"
          ariaLabel={item.ariaLabel}
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
