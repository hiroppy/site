import { createMetadata } from "../../../../utils/metadata";
import BlogList from "../_components/BlogList";
import { title, description, getStaticParams } from "./_metadata";

export async function generateStaticParams() {
  return getStaticParams();
}

export async function generateMetadata({ params }: PageProps<"/blog/[page]">) {
  const { page: pageParam } = await params;
  const currentPage = Number(pageParam);

  return createMetadata({
    path: `/blog/${currentPage}`,
    title,
    description,
  });
}

export default async function Page({ params }: PageProps<"/blog/[page]">) {
  const { page: pageParam } = await params;
  const currentPage = Number(pageParam);

  return <BlogList currentPage={currentPage} isShowSearchBox />;
}
