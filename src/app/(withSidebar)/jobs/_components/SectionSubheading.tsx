import { cn } from "../../../../utils/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
};

export function SectionSubheading({
  children,
  className,
  as: Tag = "h3",
}: Props) {
  return (
    <Tag
      className={cn(
        "text-text-main mb-4 flex items-center gap-2 text-xl font-semibold",
        className,
      )}
    >
      <span className="bg-accent h-6 w-1 rounded-full" />
      {children}
    </Tag>
  );
}
