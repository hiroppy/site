import { Link } from "../../../_components/Link";

export type Reference = {
  url: string;
  title: string;
};

type ReferencesProps = {
  references: Reference[];
};

export function References({ references }: ReferencesProps) {
  return (
    <section className="my-12">
      <h2 id="references" className="mb-4 text-xl font-bold text-gray-900">
        参考リンク
      </h2>
      <ul className="list-outside list-disc space-y-1">
        {references.map(({ url, title }) => (
          <li key={url} className="ml-4 marker:text-gray-700">
            <Link
              href={url}
              unstyled
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
