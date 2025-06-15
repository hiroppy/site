/**
 * 記事システムの設定
 * 新しいタイプや設定を追加する際はここを更新してください
 */

type ArticleTypeConfig = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  categories: CategoryConfig[];
};

type CategoryConfig = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

/**
 * 利用可能な記事タイプの設定
 */
const ARTICLE_TYPES: ArticleTypeConfig[] = [
  {
    id: "frontend",
    name: "Frontend",
    description: "Frontend development articles and resources",
    enabled: true,
    categories: [
      {
        id: "official",
        name: "Official",
        description: "Official documentation and announcements",
        enabled: true,
      },
      {
        id: "community",
        name: "Community",
        description: "Community articles and blog posts",
        enabled: true,
      },
      {
        id: "release",
        name: "Release",
        description: "Release notes and changelog updates",
        enabled: true,
      },
      {
        id: "podcast",
        name: "Podcast",
        description: "Podcast episodes and audio content",
        enabled: true,
      },
    ],
  },
  {
    id: "ai",
    name: "AI",
    description: "Artificial Intelligence and Machine Learning articles",
    enabled: false, // 将来的に有効化予定
    categories: [
      {
        id: "official",
        name: "Official",
        description: "Official AI/ML documentation and announcements",
        enabled: true,
      },
      {
        id: "community",
        name: "Community",
        description: "Community AI/ML articles and research",
        enabled: true,
      },
      {
        id: "release",
        name: "Release",
        description: "AI/ML tool and framework releases",
        enabled: true,
      },
      {
        id: "podcast",
        name: "Podcast",
        description: "AI/ML podcast episodes and audio content",
        enabled: true,
      },
    ],
  },
];

/**
 * 有効な記事タイプのみを返す
 */
function getEnabledArticleTypes(): ArticleTypeConfig[] {
  return ARTICLE_TYPES.filter((type) => type.enabled);
}

/**
 * 特定のタイプの設定を取得
 */
function getArticleTypeConfig(typeId: string): ArticleTypeConfig | undefined {
  return ARTICLE_TYPES.find((type) => type.id === typeId);
}

/**
 * 特定のタイプで有効なカテゴリのみを返す
 */
function getEnabledCategories(typeId: string): CategoryConfig[] {
  const typeConfig = getArticleTypeConfig(typeId);
  return typeConfig ? typeConfig.categories.filter((cat) => cat.enabled) : [];
}

/**
 * URLパスの検証
 */
export function validateArticlePath(path: string[]): {
  isValid: boolean;
  type?: string;
  category?: string;
  service?: string;
  error?: string;
} {
  if (path.length === 0) {
    return { isValid: false, error: "Path is empty" };
  }

  const [type, category, service] = path;

  // タイプの検証
  const typeConfig = getArticleTypeConfig(type);
  if (!typeConfig) {
    return { isValid: false, error: `Unknown article type: ${type}` };
  }

  if (!typeConfig.enabled) {
    return { isValid: false, error: `Article type is disabled: ${type}` };
  }

  // カテゴリの検証（指定されている場合）
  if (category && category !== "all") {
    const categories = getEnabledCategories(type);
    const categoryExists = categories.some((cat) => cat.id === category);
    if (!categoryExists) {
      return {
        isValid: false,
        error: `Unknown category: ${category} for type: ${type}`,
      };
    }
  }

  return {
    isValid: true,
    type,
    category: category || "all",
    service,
  };
}
