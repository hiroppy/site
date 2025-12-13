import { Content } from "../../../_components/Content";
import { getPeriod } from "../../../_utils/getPeriod";

export default async function Page({
  params,
  searchParams,
}: PageProps<"/labs/feedle/[type]/[category]/[service]">) {
  const { type, category, service } = await params;
  const period = await getPeriod(searchParams);

  return (
    <Content
      type={type}
      category={category}
      service={service}
      period={period}
    />
  );
}
