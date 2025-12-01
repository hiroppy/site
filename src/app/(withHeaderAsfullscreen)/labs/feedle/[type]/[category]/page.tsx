import { Content } from "../../_components/Content";
import { getPeriod } from "../../_utils/getPeriod";
import { getStaticParams } from "./_metadata";

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/labs/feedle/[type]/[category]">) {
  const { type, category } = await params;
  const period = await getPeriod(searchParams);

  // TODO: validation

  return <Content type={type} category={category} period={period} />;
}
