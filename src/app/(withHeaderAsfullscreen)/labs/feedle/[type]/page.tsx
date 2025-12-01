import { notFound } from "next/navigation";
import { createMetadata } from "../../../../../utils/metadata";
import { Content } from "../_components/Content";
import { ARTICLE_TYPES, ArticleType } from "../_constant";
import { getPeriod } from "../_utils/getPeriod";
import { description, getStaticParams, title } from "./_metadata";

export async function generateStaticParams() {
  return getStaticParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/labs/feedle/[type]">) {
  const { type } = await params;

  if (!ARTICLE_TYPES.includes(type as ArticleType)) {
    notFound();
  }

  return createMetadata({
    path: `/labs/feedle/${type}`,
    title: title(type),
    description,
  });
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/labs/feedle/[type]">) {
  const { type } = await params;

  if (!ARTICLE_TYPES.includes(type as ArticleType)) {
    notFound();
  }

  const period = await getPeriod(searchParams);

  return <Content type={type} period={period} />;
}
