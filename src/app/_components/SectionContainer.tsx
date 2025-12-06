import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function SectionContainer({ children }: Props) {
  return <div className="space-y-20">{children}</div>;
}
