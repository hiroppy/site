import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import { Link } from "../../../../components/Link";

type Props = {
  markdown: string;
  className?: string;
};

export function MarkdownContent({ markdown, className }: Props) {
  const components = {
    a: ({ href, children }) => <Link href={href || "#"}>{children}</Link>,
    ul: ({ children }) => <ul className="my-2 list-disc pl-5">{children}</ul>,
    li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
    p: ({ children }) => (
      <p className="mb-3 leading-relaxed last:mb-0">{children}</p>
    ),
  } as Partial<Components>;

  return (
    <div className={className}>
      <Markdown components={components}>{markdown}</Markdown>
    </div>
  );
}
