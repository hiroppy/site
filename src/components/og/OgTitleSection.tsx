type Props = {
  title: string;
  description?: string;
  tags?: string[];
};

export function OgTitleSection({ title, description, tags }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tags ? 40 : 24,
        flex: 1,
        justifyContent: "center",
        maxWidth: "1000px",
      }}
    >
      <h1
        style={{
          fontSize: "56px",
          lineHeight: "1.1",
          color: "#1a1a1a",
          fontWeight: "500",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {description && (
        <p
          style={{
            fontSize: "24px",
            lineHeight: "1.4",
            color: "#4b5563",
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
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                background: "#99630014",
                border: "1px solid #9963004D",
                borderRadius: "32px",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  color: "#996300",
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
