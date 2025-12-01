import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export function NotFoundItem({ children }: Props) {
  return <p className="text-text-sub py-12 text-center text-lg">{children}</p>;
}
