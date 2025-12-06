import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  matcher: "/blog/:path*",
};
