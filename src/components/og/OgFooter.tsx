import { OgAvatar } from "./OgAvatar";

type Props = {
  avatar: string;
};

export function OgFooter({ avatar }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 24,
        borderTop: "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <OgAvatar avatar={avatar} size={120} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: "32px",
              color: "#996300",
              fontWeight: "700",
            }}
          >
            hiroppy
          </span>
          <span
            style={{
              fontSize: "24px",
              color: "#6d6d6d",
            }}
          >
            JavaScript junkie
          </span>
        </div>
      </div>
    </div>
  );
}
