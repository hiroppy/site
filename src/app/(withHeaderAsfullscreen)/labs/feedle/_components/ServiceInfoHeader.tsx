"use client";

import { Link } from "../../../../../components/Link";
import type { ServiceGroup } from "../_utils/articlesApi";
import { ServiceIcon } from "./ServiceIcon";

type Props = {
  currentService: string;
  serviceGroups: Record<string, ServiceGroup>;
  currentType: string;
  currentCategory: string;
  currentPeriod?: string;
};

export function ServiceInfoHeader({ currentService, serviceGroups }: Props) {
  const serviceData = Object.entries(serviceGroups).find(
    ([, data]) => data.sources[0].id === currentService,
  );

  if (!serviceData) {
    return null;
  }

  const [serviceName, data] = serviceData;
  const source = data.sources[0];

  return (
    <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <ServiceIcon source={source} size="md" />
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {serviceName}
            </h2>
            {source.website && (
              <Link
                href={source.website}
                isBlank={true}
                className="text-xs text-accent hover:text-accent/80"
              >
                {source.website.replace(/^https?:\/\//, "")}
              </Link>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
          <div className="text-center">
            <div className="font-medium text-gray-900">{source.count || 0}</div>
            <div>Articles</div>
          </div>
          {source.latest && (
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {new Date(source.latest).toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>Last updated</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
