import { NextRequest, NextResponse } from "next/server";
import { fetchOGP } from "../../../../utils/ogp";

// astro時代の後方互換
export async function GET(
  req: NextRequest,
  { params }: PageProps<"/blog/[page]">,
) {
  const { page } = await params;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/posts/${page}`;
  const data = await getData(url);

  if (!data?.image) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const image = await fetch(data.image).then((res) => res.arrayBuffer());

  return new NextResponse(image ?? "", {
    headers: { "Content-Type": "image/webp" },
  });
}

async function getData(url: string) {
  "use cache";

  return await fetchOGP(url);
}
