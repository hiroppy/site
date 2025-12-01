import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Link } from "../../../../components/Link";
import { cn } from "../../../../utils/cn";

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
          <MdChevronLeft size={24} aria-hidden="true" focusable="false" />
          {prevText}
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link href={next} unstyled className="text-link flex items-center">
          {nextText}
          <MdChevronRight size={24} aria-hidden="true" focusable="false" />
        </Link>
      )}
    </div>
  );
}
