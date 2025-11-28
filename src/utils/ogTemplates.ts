/**
 * OG image templates for different page types
 * Pure JSX structure without Node.js dependencies
 */

type JSXElement = {
  type: string;
  props: {
    style?: Record<string, any>;
    children?: any;
    src?: string;
    width?: number;
    height?: number;
  };
};

// Shared decorative background elements
function createBackgroundDecorations(): JSXElement[] {
  return [
    {
      type: "div",
      props: {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(200px, -200px)",
        },
      },
    },
    {
      type: "div",
      props: {
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(-100px, 100px)",
        },
      },
    },
  ];
}

// Shared header branding
function createHeader(iconBase64: string, headerText: string): JSXElement {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 40,
      },
      children: [
        {
          type: "img",
          props: {
            src: `data:image/png;base64,${iconBase64}`,
            width: 48,
            height: 48,
            style: {
              borderRadius: "50%",
              border: "2px solid rgba(59, 130, 246, 0.5)",
            },
          },
        },
        {
          type: "span",
          props: {
            style: {
              fontSize: "24px",
              color: "#e2e8f0",
              fontWeight: "600",
            },
            children: headerText,
          },
        },
      ],
    },
  };
}

// Shared footer branding
function createFooter(iconBase64: string, pageType: string): JSXElement {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 24,
        borderTop: "1px solid rgba(148, 163, 184, 0.2)",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 16,
            },
            children: [
              {
                type: "img",
                props: {
                  src: `data:image/png;base64,${iconBase64}`,
                  width: 40,
                  height: 40,
                  style: {
                    borderRadius: "50%",
                    border: "2px solid rgba(59, 130, 246, 0.4)",
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          fontSize: "20px",
                          color: "#3b82f6",
                          fontWeight: "600",
                        },
                        children: "hiroppy",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          fontSize: "14px",
                          color: "#94a3b8",
                        },
                        children: "JavaScript Engineer",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: "16px",
              color: "#64748b",
              fontWeight: "500",
            },
            children: pageType,
          },
        },
      ],
    },
  };
}

// Title section for page templates
function createTitleSection(title: string, description?: string): JSXElement {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 24,
        flex: 1,
        justifyContent: "center",
        maxWidth: "1000px",
      },
      children: [
        {
          type: "h1",
          props: {
            style: {
              fontSize: "56px",
              lineHeight: "1.1",
              color: "#ffffff",
              fontWeight: "700",
              margin: 0,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            },
            children: title,
          },
        },
        ...(description
          ? [
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "24px",
                    lineHeight: "1.4",
                    color: "#cbd5e1",
                    margin: 0,
                    opacity: 0.9,
                  },
                  children: description,
                },
              },
            ]
          : []),
      ],
    },
  };
}

// Title section for blog templates with tags
function createBlogTitleSection(title: string, tags: string[]): JSXElement {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 32,
        flex: 1,
        justifyContent: "center",
        maxWidth: "1000px",
      },
      children: [
        {
          type: "h1",
          props: {
            style: {
              fontSize: "56px",
              lineHeight: "1.1",
              color: "#ffffff",
              fontWeight: "700",
              margin: 0,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            },
            children: title,
          },
        },
        ...(tags.length > 0
          ? [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  },
                  children: tags.slice(0, 4).map((tag) => ({
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 20px",
                        background: "rgba(59, 130, 246, 0.15)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "24px",
                        backdropFilter: "blur(8px)",
                      },
                      children: {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "18px",
                            color: "#93c5fd",
                            fontWeight: "500",
                          },
                          children: `#${tag}`,
                        },
                      },
                    },
                  })),
                },
              },
            ]
          : []),
      ],
    },
  };
}

// Shared template structure
function createBaseTemplate(
  iconBase64: string,
  headerText: string,
  titleContent: JSXElement,
  pageType: string,
): JSXElement {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        position: "relative",
      },
      children: [
        ...createBackgroundDecorations(),
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "80px 80px 60px 80px",
              height: "100%",
              position: "relative",
            },
            children: [
              createHeader(iconBase64, headerText),
              titleContent,
              createFooter(iconBase64, pageType),
            ],
          },
        },
      ],
    },
  };
}

// Public API - Page OG template
type OgTemplateProps = {
  title: string;
  pageType: string;
  description?: string;
  iconBase64: string;
};

export function createPageOgTemplate({
  title,
  pageType,
  description,
  iconBase64,
}: OgTemplateProps) {
  return createBaseTemplate(
    iconBase64,
    "hiroppy.me",
    createTitleSection(title, description),
    pageType,
  );
}

// Public API - Blog OG template
export function createBlogOgTemplate({
  title,
  iconBase64,
  tags,
}: {
  title: string;
  iconBase64: string;
  tags: string[];
}) {
  return createBaseTemplate(
    iconBase64,
    "技術探し",
    createBlogTitleSection(title, tags),
    "Blog Post",
  );
}
