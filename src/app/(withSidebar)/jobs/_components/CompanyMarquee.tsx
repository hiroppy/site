import type { Jobs } from "hiroppy/types";
import { Image } from "../../../../components/Image";

type Props = {
  meta: Jobs["meta"];
};

export function CompanyMarquee({ meta }: Props) {
  const companies = Object.values(meta);

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="flex w-max gap-8 hover:[animation-play-state:paused] motion-safe:animate-marquee">
        {[...companies, ...companies].map((company, index) => (
          <div key={index} className="shrink-0">
            <Image
              src={company.image}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg bg-white p-2 opacity-70 shadow-sm grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
