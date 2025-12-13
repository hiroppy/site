type Props = {
  avatar: string;
  size: number;
};

export function OgAvatar({ avatar, size }: Props) {
  return (
    <img
      src={`data:image/jpeg;base64,${avatar}`}
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        border: "2px solid #9963004D",
      }}
    />
  );
}
