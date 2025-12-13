import type { ReactNode } from "react";
import { cn } from "../utils/cn";

type SectionContainerProps = {
  className?: string;
  children: ReactNode;
};

export function SectionContainer({
  className,
  children,
}: SectionContainerProps) {
  return <div className={cn("space-y-20", className)}>{children}</div>;
}

type SectionProps = {
  title: string;
  className?: string;
  children?: ReactNode;
  headingLevel?: "h1" | "h2";
};

export function Section({
  title,
  className,
  children,
  headingLevel = "h2",
}: SectionProps) {
  const HeadingTag = headingLevel;

  return (
    <section className={className}>
      <HeadingTag className="border-line text-text-sub mb-6 inline-block border-b pb-2 text-2xl font-medium">
        {title}
      </HeadingTag>
      {children}
    </section>
  );
}
