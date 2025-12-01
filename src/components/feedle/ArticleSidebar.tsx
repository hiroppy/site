import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Icon } from "../Icon";
import { DateFilter } from "./DateFilter";
import { ServicesDialog } from "./ServicesDialog";
import type { ServicesDialogHandle } from "./ServicesDialog";
import { ServiceListItem } from "./ServiceListItem";
import { SidebarSection } from "./SidebarSection";
import { NavItem } from "./NavItem";
import type { ServiceGroup } from "../../utils/feedle/articlesApi";
import {
  readIgnoredSourceIds,
  SUBSCRIPTION_CHANGED_EVENT,
} from "../../utils/feedle/subscriptionStore";

type Props = {
  currentType: string;
  currentCategory: string;
  currentService?: string;
  currentPeriod?: string;
  serviceGroups: Record<string, ServiceGroup>;
  lastHarvested?: Date;
};

export function ArticleSidebar({
  currentType,
  currentCategory,
  currentService,
  currentPeriod,
  serviceGroups,
}: Props) {
  const [ignoredSources, setIgnoredSources] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const servicesDialogRef = useRef<ServicesDialogHandle>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadIgnored = async () => {
      const ids = await readIgnoredSourceIds();
      if (isMounted) {
        setIgnoredSources(ids);
      }
    };

    loadIgnored();

    const handleSubscriptionChanged = () => {
      loadIgnored();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        SUBSCRIPTION_CHANGED_EVENT,
        handleSubscriptionChanged,
      );
    }

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener(
          SUBSCRIPTION_CHANGED_EVENT,
          handleSubscriptionChanged,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || typeof window === "undefined") return;

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth < 768 && target.closest("a")) {
        setIsSidebarOpen(false);
      }
    };

    sidebar.addEventListener("click", handleLinkClick);
    return () => {
      sidebar.removeEventListener("click", handleLinkClick);
    };
  }, []);

  const sortedServices = useMemo(() => {
    return Object.entries(serviceGroups).sort(([a], [b]) => {
      const aSelected = serviceGroups[a].sources[0].id === currentService;
      const bSelected = serviceGroups[b].sources[0].id === currentService;

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.localeCompare(b);
    });
  }, [serviceGroups, currentService]);

  const filteredServices = useMemo(() => {
    if (currentService) {
      return sortedServices;
    }

    return sortedServices.filter(([, serviceData]) => {
      const sourceId = serviceData.sources[0].id;
      return !ignoredSources.has(sourceId);
    });
  }, [currentService, ignoredSources, sortedServices]);

  const visibleSourceCount = filteredServices.length;

  const sidebarTransformClass = isSidebarOpen
    ? "translate-x-0"
    : "-translate-x-full";
  const backdropClass = isSidebarOpen
    ? "pointer-events-auto opacity-100"
    : "pointer-events-none opacity-0";

  return (
    <>
      <div
        id="sidebar-backdrop"
        class={`pointer-events-none fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden ${backdropClass}`}
      />

      <aside
        id="sidebar"
        ref={sidebarRef}
        class={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform border-r border-gray-200 bg-gray-50 transition-transform duration-300 ease-in-out md:relative md:z-auto md:h-full md:translate-x-0 ${sidebarTransformClass}`}
      >
        <div class="flex h-full flex-col overflow-hidden">
          <SidebarSection>
            <div class="space-y-1">
              <NavItem
                href={`/labs/feedle/frontend${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                isActive={currentType === "frontend"}
              >
                <Icon icon="mdi:palette" className="mr-2 h-4 w-4" />
                Frontend
              </NavItem>
              <NavItem
                href={`/labs/feedle/ai${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                isActive={currentType === "ai"}
              >
                <Icon icon="mdi:robot" className="mr-2 h-4 w-4" />
                AI
              </NavItem>
            </div>
          </SidebarSection>

          <SidebarSection title="Period" padding="compact">
            <DateFilter
              currentType={currentType}
              currentCategory={currentCategory}
              currentService={currentService}
              currentPeriod={currentPeriod}
            />
          </SidebarSection>

          <div class="shrink-0 border-b border-gray-200">
            <div class="p-3">
              <h3 class="mb-2 text-sm font-medium text-gray-700">Categories</h3>
              <div class="space-y-1">
                <NavItem
                  href={`/labs/feedle/${currentType}${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                  isActive={currentCategory === "all"}
                >
                  All
                </NavItem>
                <NavItem
                  href={`/labs/feedle/${currentType}/official${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                  isActive={currentCategory === "official"}
                >
                  Official
                </NavItem>
                <NavItem
                  href={`/labs/feedle/${currentType}/community${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                  isActive={currentCategory === "community"}
                >
                  Community
                </NavItem>
                <NavItem
                  href={`/labs/feedle/${currentType}/release${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                  isActive={currentCategory === "release"}
                >
                  Release
                </NavItem>
                <NavItem
                  href={`/labs/feedle/${currentType}/podcast${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                  isActive={currentCategory === "podcast"}
                >
                  Podcast
                </NavItem>
              </div>
            </div>
          </div>

          <div class="flex flex-1 flex-col overflow-hidden">
            <div class="p-3">
              <div class="flex items-center justify-between">
                <h3
                  id="sources-count"
                  class="text-sm font-medium text-gray-700"
                >
                  Sources ({visibleSourceCount})
                </h3>
                <button
                  id="services-dialog-btn"
                  type="button"
                  class="cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title="View all services"
                  onClick={() => servicesDialogRef.current?.open()}
                >
                  <Icon icon="mdi:format-list-bulleted" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-2">
              <div id="sidebar-services" class="space-y-1">
                <NavItem
                  href={`/labs/feedle/${currentType}/${currentCategory}${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                  isActive={!currentService}
                  icon="mdi:all-inclusive"
                >
                  All
                </NavItem>

                {filteredServices.map(([serviceName, serviceData]) => {
                  const isSelected =
                    serviceData.sources[0].id === currentService;
                  return (
                    <ServiceListItem
                      key={serviceName}
                      serviceName={serviceName}
                      serviceData={serviceData}
                      href={`/labs/feedle/${currentType}/${currentCategory === "all" ? serviceData.sources[0].kind : currentCategory}/${serviceData.sources[0].id}${currentPeriod && currentPeriod !== "all" ? `?period=${currentPeriod}` : ""}`}
                      isSelected={isSelected}
                      variant="sidebar"
                      showCount={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <ServicesDialog
        ref={servicesDialogRef}
        serviceGroups={serviceGroups}
        currentType={currentType}
        currentCategory={currentCategory}
        currentPeriod={currentPeriod}
        showLastUpdated={false}
        ignoredSources={ignoredSources}
        onSubscriptionChange={async () => {
          const ids = await readIgnoredSourceIds();
          setIgnoredSources(ids);
        }}
      />

      <button
        id="hamburger-btn"
        class="fixed top-20 left-4 z-40 rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-gray-100 md:hidden"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <Icon icon="mdi:menu" className="h-6 w-6 text-gray-600" />
      </button>
    </>
  );
}
