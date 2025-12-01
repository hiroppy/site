type Props = {
  id: string;
};

export function YoutubeCard({ id }: Props) {
  return (
    <div className="youtube-container">
      <iframe
        src={`https://www.youtube.com/embed/${id}?feature=oembed`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="YouTube video player"
      />
    </div>
  );
}
