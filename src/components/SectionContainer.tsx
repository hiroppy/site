import type { ComponentChildren } from "preact";

type Props = {
  children: ComponentChildren;
};

export function SectionContainer({ children }: Props) {
  return <div className="space-y-20">{children}</div>;
}
