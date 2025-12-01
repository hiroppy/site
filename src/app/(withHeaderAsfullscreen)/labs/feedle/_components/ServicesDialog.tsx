import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog, type DialogHandle } from "../../../../../components/Dialog";
import { SearchInputField } from "../../../../../components/SearchInputField";
import type { ServiceGroup } from "../_utils/articlesApi";
import { ServiceListItem } from "./ServiceListItem";

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
};

export const ServicesDialog = forwardRef<ServicesDialogHandle, Props>(
  (
    {
      serviceGroups,
      currentType,
      currentCategory,
      currentPeriod,
      showLastUpdated = false,
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

    const handleLinkClick = () => {
      dialogRef.current?.close();
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
        <div className="border-b border-gray-200 p-6 pb-4">
          <SearchInputField
            id="sources-search"
            placeholder="Search sources..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">
          <div
            id="sources-grid"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            style={{ display: filteredServices.length === 0 ? "none" : "grid" }}
          >
            {filteredServices.map(([serviceName, serviceData]) => {
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
                  showLastUpdated={showLastUpdated}
                  onLinkClick={handleLinkClick}
                />
              );
            })}
          </div>
          <div
            id="no-results"
            className="flex flex-1 flex-col items-center justify-center text-gray-500"
            style={{ display: filteredServices.length === 0 ? "flex" : "none" }}
          >
            <p>No sources found matching your search.</p>
          </div>
        </div>
      </Dialog>
    );
  },
);
