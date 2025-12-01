import { getSidebarData } from "../../_utils/feedleData";
import { CategorySection } from "./CategorySection";
import { DateFilterSection } from "./DateFilterSection";
import { ServiceSection } from "./ServiceSection";
import { SidebarMobileControls } from "./SidebarMobileControls";
import { TypeSection } from "./TypeSection";

type Props = {
  params: Promise<{ type: string; category?: string; service?: string }>;
};

export async function Sidebar({ params }: Props) {
  const { type, category, service } = await params;
  const pathSegments = [type, category, service].filter(Boolean) as string[];

  const { serviceGroups } = await getSidebarData(pathSegments);

  return (
    <SidebarMobileControls>
      <div className="flex h-full flex-col overflow-hidden">
        <TypeSection />
        <DateFilterSection />
        <CategorySection />
        <ServiceSection serviceGroups={serviceGroups} />
      </div>
    </SidebarMobileControls>
  );
}
