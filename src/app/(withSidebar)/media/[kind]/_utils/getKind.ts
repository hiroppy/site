import { notFound } from "next/navigation";
import { KINDS, type Kind } from "../_constants";

export function getKind(kind: string) {
  if (!KINDS.includes(kind as Kind)) {
    notFound();
  }

  return kind as Kind;
}
