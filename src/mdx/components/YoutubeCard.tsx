type Props = {
  id: string;
};

export function YoutubeCard({ id }: Props) {
  return (
    <iframe
      width="480"
      height="270"
      src={`https://www.youtube.com/embed/${id}?feature=oembed`}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      id="widget2"
      loading="lazy"
      title="YouTube video player"
    />
  );
}
