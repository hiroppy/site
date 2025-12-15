import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/blog/:path*", "/labs/feedle"],
};

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

    // 数字のみの場合、ページネーション（1, 2, 3...）か年号（2018...）かをチェック
    if (/^\d+$/.test(slug)) {
      const num = parseInt(slug, 10);

      // 2018以降の年号の場合は /blog/posts/:year にリダイレクト
      if (num >= 2018) {
        const url = request.nextUrl.clone();

        url.pathname = `/blog/posts/${slug}`;

        return NextResponse.redirect(url, 308);
      }

      // それ以外の数字（ページネーション）はそのまま通過
      return NextResponse.next();
    }

    // 数字以外のslugは /blog/posts/:slug にリダイレクト
    const url = request.nextUrl.clone();

    url.pathname = `/blog/posts/${slug}`;

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}
