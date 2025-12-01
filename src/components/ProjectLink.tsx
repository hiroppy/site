import { Icon } from "./Icon";
import { Link } from "./Link";
import { ListContainer } from "./ListContainer";

type Project = {
  href?: string;
  url?: string;
  name: string;
  description?: string | null;
  stars: number;
  image?: string;
};

type Props = {
  projects: Project[];
};

export function ProjectLinks({ projects }: Props) {
  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <ListContainer className="space-y-6">
      {projects.map((project) => {
        const url = project.href || project.url || "";
        return (
          <li key={url} className="block">
            <Link
              href={url}
              unstyled
              className="text-text-main block no-underline hover:opacity-60"
            >
              <span className="flex items-center justify-between text-xl leading-[1.5] font-normal">
                <span className="inline-flex items-center gap-2">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={`${project.name} icon`}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <span className="inline-flex items-center gap-1">
                    {project.name}
                  </span>
                </span>
                <span
                  className="text-accent ml-3 inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-lg font-medium"
                  data-testid="github-star-count"
                >
                  <Icon icon="mdi:star" width={16} height={16} />
                  {formatStars(project.stars)}
                </span>
              </span>
              {project.description && (
                <span className="text-text-sub mt-1 block text-sm">
                  {project.description}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ListContainer>
  );
}
