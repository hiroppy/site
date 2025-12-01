type Props = {
  avatar: string;
  size: number;
};

export async function OgAvatar({ avatar, size }: Props) {
  return (
    <img
      src={`data:image/png;base64,${avatar}`}
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        border: "2px solid #9963004D",
      }}
    />
  );
}
