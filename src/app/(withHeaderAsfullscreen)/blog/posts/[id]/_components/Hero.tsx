import { MdCalendarToday } from "react-icons/md";
import { Image } from "../../../../../../components/Image";
import { formatDate } from "../../../../../../utils/formatDate";

type HeroProps = {
  title: string;
  image?: string;
  date: Date;
};

export function Hero({ title, image, date }: HeroProps) {
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
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      <div className="absolute right-4 bottom-6 left-4 md:right-8 md:left-8">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {title}
        </h1>
        <div className="flex items-center text-white/90 gap-2">
          <MdCalendarToday size={16} aria-hidden="true" focusable="false" />
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </div>
  );
}
