import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "preact/compat";
import { Icon } from "../Icon";
import { Dialog, type DialogHandle } from "./Dialog";
import { SearchInput } from "./SearchInput";
import { ServiceListItem } from "./ServiceListItem";
import type { ServiceGroup } from "../../utils/feedle/articlesApi";
import {
  SUBSCRIPTION_CHANGED_EVENT,
  SUBSCRIPTION_TYPE,
  toggleSourceSubscription,
} from "../../utils/feedle/subscriptionStore";

function buildServiceUrl(
  serviceData: ServiceGroup,
  currentCategory: string,
  currentType: string,
  currentPeriod?: string,
) {
  const firstSource = serviceData.sources[0];
  const baseUrl =
    currentCategory === "all"
      ? `/labs/feedle/${currentType}/${firstSource.kind}/${firstSource.id}`
      : `/labs/feedle/${currentType}/${currentCategory}/${firstSource.id}`;

  return currentPeriod && currentPeriod !== "all"
    ? `${baseUrl}?period=${currentPeriod}`
    : baseUrl;
}

export type ServicesDialogHandle = {
  open: () => void;
};

type Props = {
  serviceGroups: Record<string, ServiceGroup>;
  currentType: string;
  currentCategory: string;
  currentPeriod?: string;
  showLastUpdated?: boolean;
  ignoredSources: Set<string>;
  onSubscriptionChange?: () => void;
};

export const ServicesDialog = forwardRef<ServicesDialogHandle, Props>(
  (
    {
      serviceGroups,
      currentType,
      currentCategory,
      currentPeriod,
      showLastUpdated = false,
      ignoredSources,
      onSubscriptionChange,
    },
    ref,
  ) => {
    const [searchTerm, setSearchTerm] = useState("");
    const dialogRef = useRef<DialogHandle>(null);

    useImperativeHandle(
      ref,
      () => ({
        open: () => dialogRef.current?.showModal(),
      }),
      [],
    );

    const filteredServices = useMemo(() => {
      const entries = Object.entries(serviceGroups).sort(([a], [b]) =>
        a.localeCompare(b),
      );

      if (!searchTerm) {
        return entries;
      }

      return entries.filter(([serviceName, serviceData]) => {
        const normalizedTerm = searchTerm.toLowerCase().trim();
        const firstSource = serviceData.sources[0];
        const matchesName = serviceName.toLowerCase().includes(normalizedTerm);
        const matchesKind = firstSource.kind
          .toLowerCase()
          .includes(normalizedTerm);
        return matchesName || matchesKind;
      });
    }, [serviceGroups, searchTerm]);

    const handleToggle = async (sourceId: string) => {
      const subscribed = await toggleSourceSubscription(
        SUBSCRIPTION_TYPE.SOURCE,
        sourceId,
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(SUBSCRIPTION_CHANGED_EVENT, {
            detail: { sourceId, subscribed, type: SUBSCRIPTION_TYPE.SOURCE },
          }),
        );
      }
      onSubscriptionChange?.();
    };

    return (
      <Dialog
        id="services-dialog"
        title={`All Sources (${Object.keys(serviceGroups).length})`}
        maxWidth="max-w-4xl"
        backdrop="blur"
        position="center"
        contentClass="h-[70vh] max-sm:h-[85vh] overflow-hidden flex flex-col"
        ref={dialogRef}
      >
        <div class="border-b border-gray-200 p-6 pb-4">
          <SearchInput
            id="sources-search"
            placeholder="Search sources..."
            value={searchTerm}
            onInput={(event) =>
              setSearchTerm((event.target as HTMLInputElement).value)
            }
          />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto p-6 pt-4">
          <div
            id="sources-grid"
            class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            style={{ display: filteredServices.length === 0 ? "none" : "grid" }}
          >
            {filteredServices.map(([serviceName, serviceData]) => {
              const sourceId = serviceData.sources[0].id;
              const isSubscribed = !ignoredSources.has(sourceId);
              return (
                <ServiceListItem
                  key={serviceName}
                  serviceName={serviceName}
                  serviceData={serviceData}
                  href={buildServiceUrl(
                    serviceData,
                    currentCategory,
                    currentType,
                    currentPeriod,
                  )}
                  variant="dialog"
                  showVisibilityToggle={true}
                  showLastUpdated={showLastUpdated}
                  subscribed={isSubscribed}
                  onToggle={() => handleToggle(sourceId)}
                />
              );
            })}
          </div>
          <div
            id="no-results"
            class="flex flex-1 flex-col items-center justify-center text-gray-500"
            style={{ display: filteredServices.length === 0 ? "flex" : "none" }}
          >
            <Icon
              icon="mdi:magnify"
              className="mx-auto mb-4 h-12 w-12 text-gray-300"
            />
            <p>No sources found matching your search.</p>
          </div>
        </div>
      </Dialog>
    );
  },
);
