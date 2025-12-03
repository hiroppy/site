import { Icon } from "../../../../_components/Icon";
import { Image } from "../../../../_components/Image";
import { formatDate } from "../../../../_utils/formatDate";

type HeroProps = {
  title: string;
  image?: string;
  date: Date;
};

export function Hero({ title, image, date }: HeroProps) {
  const formattedDate = formatDate(date);
  return (
    <div className="relative">
      {image ? (
        <Image
          src={image}
          alt={title}
          width={800}
          height={400}
          lazy={false}
          fetchPriority="high"
          className="h-64 w-full object-cover md:h-80"
        />
      ) : (
        <div className="flex h-64 w-full items-center justify-center bg-linear-to-br from-blue-500 to-purple-400 md:h-80" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      <div className="absolute right-4 bottom-6 left-4 md:right-8 md:left-8">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {title}
        </h1>
        <div className="flex items-center text-white/90">
          <Icon icon="mdi:calendar" width={16} height={16} />
          <span className="ml-2">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
