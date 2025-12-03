import { Icon } from "../../../_components/Icon";
import { Link } from "../../../_components/Link";
import { cn } from "../../../_utils/cn";

type Props = {
  prev?: string;
  prevText?: string;
  next?: string;
  nextText?: string;
  className?: string;
};

export function Pagination({
  prev,
  prevText = "Back",
  next,
  nextText = "Next Page",
  className,
}: Props) {
  return (
    <div className={cn("mt-4 flex items-center justify-between", className)}>
      {prev ? (
        <Link href={prev} unstyled className="text-link flex items-center">
          <Icon icon="mdi:chevron-left" width="24" height="24" />
          {prevText}
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link href={next} unstyled className="text-link flex items-center">
          {nextText}
          <Icon icon="mdi:chevron-right" width="24" height="24" />
        </Link>
      )}
    </div>
  );
}
