import { readFileSync } from "node:fs";
import { join } from "node:path";

const OG_COLORS = {
  brand: "#996300",
  brandBorder: "rgba(153, 99, 0, 0.3)",
  brandBgLight: "rgba(153, 99, 0, 0.08)",
  brandBgAccent2: "rgba(230, 170, 50, 0.06)",
  brandBgAccent3: "rgba(250, 240, 220, 0.15)",
  textPrimary: "#1a1a1a",
  textSecondary: "#6d6d6d",
  textLight: "#4b5563",
  text: "#333333",
  background: "#fdfbf7",
  border: "rgba(224, 224, 224, 0.4)",
} as const;

const OG_FONTS = {
  titleSize: 56,
  headerSize: 24,
  subtitleSize: 24,
  footerNameSize: 20,
  footerTitleSize: 14,
  tagSize: 18,
  footerTypeSize: 16,
} as const;

const OG_SPACING = {
  padding: 80,
  footerPadding: 60,
  headerGap: 16,
  headerMarginBottom: 40,
  footerPaddingTop: 24,
  footerImageSize: 40,
  titleGap: 24,
  titleGapBlog: 32,
  tagGap: 12,
  tagPadding: 24,
  tagPaddingX: 20,
  tagPaddingY: 8,
  footerGap: 16,
  footerFlexGap: 2,
} as const;

function OgAvatar({ size }: { size: number }) {
  // TODO: move to async layer
  const me = readFileSync(
    join(process.cwd(), "public/images/meta/me.png"),
    "base64",
  );

  return (
    <img
      src={`data:image/png;base64,${me}`}
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        border: `2px solid ${OG_COLORS.brandBorder}`,
      }}
    />
  );
}

function OgBackgroundDecorations() {
  const decorations = [
    {
      width: 600,
      height: 600,
      color: OG_COLORS.brandBgLight,
      gradient: 70,
      transform: "translate(200px, -200px)",
      position: { top: 0, right: 0 },
    },
    {
      width: 400,
      height: 400,
      color: OG_COLORS.brandBgAccent2,
      gradient: 70,
      transform: "translate(-100px, 100px)",
      position: { bottom: 0, left: 0 },
    },
    {
      width: 800,
      height: 800,
      color: OG_COLORS.brandBgAccent3,
      gradient: 60,
      transform: "translate(-400px, -400px)",
      position: { top: 315, left: 600 },
    },
  ];

  return (
    <>
      {decorations.map((deco, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...deco.position,
            width: `${deco.width}px`,
            height: `${deco.height}px`,
            background: `radial-gradient(circle, ${deco.color} 0%, transparent ${deco.gradient}%)`,
            borderRadius: "50%",
            transform: deco.transform,
          }}
        />
      ))}
    </>
  );
}

function OgHeader({ headerText }: { headerText: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: OG_SPACING.headerGap,
        marginBottom: OG_SPACING.headerMarginBottom,
      }}
    >
      <OgAvatar size={48} />
      <span
        style={{
          fontSize: `${OG_FONTS.headerSize}px`,
          color: OG_COLORS.text,
          fontWeight: "600",
        }}
      >
        {headerText}
      </span>
    </div>
  );
}

function OgFooter({ pageType }: { pageType: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: OG_SPACING.footerPaddingTop,
        borderTop: `1px solid ${OG_COLORS.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: OG_SPACING.footerGap,
        }}
      >
        <OgAvatar size={OG_SPACING.footerImageSize} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: OG_SPACING.footerFlexGap,
          }}
        >
          <span
            style={{
              fontSize: `${OG_FONTS.footerNameSize}px`,
              color: OG_COLORS.brand,
              fontWeight: "600",
            }}
          >
            hiroppy
          </span>
          <span
            style={{
              fontSize: `${OG_FONTS.footerTitleSize}px`,
              color: OG_COLORS.textSecondary,
            }}
          >
            Web Engineer
          </span>
        </div>
      </div>
      <div
        style={{
          fontSize: `${OG_FONTS.footerTypeSize}px`,
          color: OG_COLORS.textSecondary,
          fontWeight: "500",
        }}
      >
        {pageType}
      </div>
    </div>
  );
}

export function OgTitleSection({
  title,
  description,
  tags,
}: {
  title: string;
  description?: string;
  tags?: string[];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tags ? OG_SPACING.titleGapBlog : OG_SPACING.titleGap,
        flex: 1,
        justifyContent: "center",
        maxWidth: "1000px",
      }}
    >
      <h1
        style={{
          fontSize: `${OG_FONTS.titleSize}px`,
          lineHeight: "1.1",
          color: OG_COLORS.textPrimary,
          fontWeight: "700",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {description && (
        <p
          style={{
            fontSize: `${OG_FONTS.subtitleSize}px`,
            lineHeight: "1.4",
            color: OG_COLORS.textLight,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
      {tags && tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: OG_SPACING.tagGap,
            flexWrap: "wrap",
          }}
        >
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                padding: `${OG_SPACING.tagPaddingY}px ${OG_SPACING.tagPaddingX}px`,
                background: OG_COLORS.brandBgLight,
                border: `1px solid ${OG_COLORS.brandBorder}`,
                borderRadius: `${OG_SPACING.tagPadding}px`,
              }}
            >
              <span
                style={{
                  fontSize: `${OG_FONTS.tagSize}px`,
                  color: OG_COLORS.brand,
                  fontWeight: "500",
                }}
              >
                #{tag}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OgBaseTemplate({
  headerText,
  titleContent,
  pageType,
}: {
  headerText: string;
  titleContent: React.ReactNode;
  pageType: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: OG_COLORS.background,
        position: "relative",
      }}
    >
      <OgBackgroundDecorations />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${OG_SPACING.padding}px ${OG_SPACING.padding}px ${OG_SPACING.footerPadding}px ${OG_SPACING.padding}px`,
          height: "100%",
          position: "relative",
        }}
      >
        <OgHeader headerText={headerText} />
        {titleContent}
        <OgFooter pageType={pageType} />
      </div>
    </div>
  );
}
