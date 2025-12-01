import { MdCheckCircle, MdWarning } from "react-icons/md";
import { Link } from "../../../../../../components/Link";
import { HATENA_BLOG_ENTRY_URL } from "../../../../../../constants";

type OverOneYearOldLabelProps = {
  publishedAt: Date;
};

export function OverOneYearOldLabel({ publishedAt }: OverOneYearOldLabelProps) {
  const now = new Date();
  const diffDate =
    (now.getTime() - new Date(publishedAt).getTime()) / (60 * 60 * 1000 * 24);

  if (diffDate > 365) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-center">
          <MdWarning
            className="mr-2 text-yellow-600"
            size={20}
            aria-hidden="true"
            focusable="false"
          />
          <span className="text-sm font-medium text-yellow-800">
            この記事は1年以上更新されていません
          </span>
        </div>
      </div>
    );
  }

  return null;
}

type HatenaMigrationLabelProps = {
  hatenaPath: string | undefined;
};

export function HatenaMigrationLabel({
  hatenaPath,
}: HatenaMigrationLabelProps) {
  if (hatenaPath) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center">
          <MdCheckCircle
            className="mr-2 text-blue-600"
            size={20}
            aria-hidden="true"
            focusable="false"
          />
          <span className="text-sm text-blue-800">
            この記事は{" "}
            <Link
              href={`${HATENA_BLOG_ENTRY_URL}/${hatenaPath}`}
              className="underline"
            >
              Hatena Blog
            </Link>{" "}
            からの移行記事です
          </span>
        </div>
      </div>
    );
  }

  return null;
}
