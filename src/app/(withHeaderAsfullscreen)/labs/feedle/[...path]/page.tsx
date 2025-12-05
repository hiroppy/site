import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TwoPaneLayout } from "../../../../_components/TwoPaneLayout";
import { createMetadata } from "../../../../_utils/metadata";
import { ArticleModal } from "../_components/ArticleModal";
import { ArticleSidebar } from "../_components/ArticleSidebar";
import { ContentArea } from "../_components/ContentArea";
import { RSSFeedButtons } from "../_components/RSSFeedButtons";
import { ServiceInfoHeader } from "../_components/ServiceInfoHeader";
import { BASE_PATH, generatePageTitle } from "../_utils/feedle/feedleConfig";
import { getFeedleData } from "../_utils/feedle/feedleData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  const pathSegments = path || [];

  try {
    const data = await getFeedleData(pathSegments, "all");
    const { currentType, currentCategory, currentService } = data;
    const pageTitle = generatePageTitle(
      currentType,
      currentCategory,
      currentService,
    );

    // OG用の説明文を生成
    let desc = "Tech article aggregation platform";
    if (currentType !== "frontend") {
      desc += ` - ${currentType.charAt(0).toUpperCase() + currentType.slice(1)} articles`;
    }
    if (currentCategory && currentCategory !== "all") {
      desc += ` from ${currentCategory}`;
    }
    if (currentService) {
      desc += ` - ${currentService}`;
    }

    // OG画像のパス設定（静的ファイルを参照）
    const ogImagePath = `${BASE_PATH}/${path?.join("/") || "frontend"}/og.png`;

    const metadata = createMetadata({
      path: `/labs/feedle/${pathSegments.join("/")}`,
      title: pageTitle,
      description: desc,
    });

    return {
      ...metadata,
      openGraph: {
        ...metadata.openGraph,
        title: pageTitle,
        description: desc,
        images: [ogImagePath],
      },
    };
  } catch {
    return createMetadata({
      path: "/labs/feedle",
      title: "Feedle",
      description: "Tech article aggregation platform",
    });
  }
}

async function Content({
  params,
  searchParams,
}: PageProps<"/labs/feedle/[...path]">) {
  const { path } = await params;
  const { period } = await searchParams;
  const pathSegments = path || [];
  const currentPeriod = (period as string) || "all";

  // データの取得
  let data;
  try {
    data = await getFeedleData(pathSegments, currentPeriod);
  } catch {
    // 無効なパスの場合はfrontendにリダイレクト
    redirect(`${BASE_PATH}/frontend`);
  }

  const {
    currentType,
    currentCategory,
    currentService,
    articles,
    sources,
    serviceGroups,
    lastHarvested,
    error,
  } = data;

  return (
    <>
      <TwoPaneLayout
        sidebar={
          <ArticleSidebar
            currentType={currentType}
            currentCategory={currentCategory}
            currentService={currentService}
            currentPeriod={currentPeriod}
            serviceGroups={serviceGroups}
            lastHarvested={lastHarvested}
          />
        }
        content={
          <div className="flex h-full flex-col">
            {currentService && (
              <ServiceInfoHeader
                currentService={currentService}
                serviceGroups={serviceGroups}
                currentType={currentType}
                currentCategory={currentCategory}
                currentPeriod={currentPeriod}
              />
            )}

            {!currentService && (
              <RSSFeedButtons
                currentType={currentType}
                lastHarvested={lastHarvested}
              />
            )}

            <ContentArea error={error} articles={articles} sources={sources} />
          </div>
        }
      />
      <ArticleModal />
    </>
  );
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/labs/feedle/[...path]">) {
  return (
    <Suspense>
      <Content params={params} searchParams={searchParams} />
    </Suspense>
  );
}
