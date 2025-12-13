import sponsors from "hiroppy/generated/sponsors.json";
import { Avatar } from "../../../components/Avatar";
import { Link } from "../../../components/Link";

export async function Sponsors() {
  return (
    <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-3">
      {[...sponsors.current, ...sponsors.past].map(({ name, avatar, href }) => (
        <Link
          key={name || avatar}
          href={
            href?.includes("https://docs.github.com/sponsors")
              ? "https://github.com"
              : (href ?? "https://github.com")
          }
          unstyled
          className="border-line text-text-sub inline-flex items-center gap-2 rounded border px-3 py-2 text-base font-medium no-underline transition-colors hover:bg-gray-100"
        >
          {avatar && <Avatar src={avatar} alt="" size="xs" lazy />}
          <span className="truncate">{name ?? "Private user"}</span>
        </Link>
      ))}
    </div>
  );
}
