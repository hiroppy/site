type Props = {
  id: string;
  title?: string;
};

export function GoogleSlidesCard({
  id,
  title = "Google Slides Presentation",
}: Props) {
  return (
    <div className="google-slides-container">
      <iframe
        src={`https://docs.google.com/presentation/d/e/${id}/embed`}
        title={title}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
