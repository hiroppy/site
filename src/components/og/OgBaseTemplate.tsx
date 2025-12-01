import { OgFooter } from "./OgFooter";

type Props = {
  avatar: string;
  headerText: string;
  titleContent: React.ReactNode;
};

export function OgBaseTemplate({ avatar, titleContent }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#fdfbf7",
        position: "relative",
        padding: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 80px 60px 80px",
          height: "100%",
          position: "relative",
          border: "4px solid #777",
          borderRadius: "32px",
        }}
      >
        {titleContent}
        <OgFooter avatar={avatar} />
      </div>
    </div>
  );
}
