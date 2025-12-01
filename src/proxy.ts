import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/labs/feedle") {
    const url = request.nextUrl.clone();

    url.pathname = "/labs/feedle/frontend";

    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/blog") {
    const url = request.nextUrl.clone();

    url.pathname = "/blog/1";

    return NextResponse.redirect(url, 308);
  }

  // すでにリリース済みの/blog/:idを/blog/posts/:idへリダイレクトさせる
  const blogPostMatch = pathname.match(/^\/blog\/([^/]+)$/);

  if (blogPostMatch) {
    const slug = blogPostMatch[1];

    if (slug === "rss.xml") {
      return NextResponse.next();
    }

    if (!/^\d+$/.test(slug)) {
      const url = request.nextUrl.clone();

      url.pathname = `/blog/posts/${slug}`;

      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/labs/feedle"],
};
