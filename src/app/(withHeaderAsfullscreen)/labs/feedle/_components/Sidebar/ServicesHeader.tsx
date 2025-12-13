"use client";

import { useRef } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { useCurrentCondition } from "../../_hooks/useCurrentCondition";
import type { ServiceGroup } from "../../_utils/articlesApi";
import { ServicesDialog, type ServicesDialogHandle } from "../ServicesDialog";

type Props = {
  serviceGroups: Record<string, ServiceGroup>;
  visibleSourceCount: number;
};

export function ServicesHeader({ serviceGroups, visibleSourceCount }: Props) {
  const { currentType, currentPeriod, currentCategory } = useCurrentCondition();
  const servicesDialogRef = useRef<ServicesDialogHandle>(null);

  return (
    <>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 id="sources-count" className="text-sm font-medium text-gray-700">
            Sources ({visibleSourceCount})
          </h3>
          <button
            id="services-dialog-btn"
            type="button"
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="View all services"
            onClick={() => servicesDialogRef.current?.open()}
          >
            <MdFormatListBulleted className="h-4 w-4" size={20} />
          </button>
        </div>
      </div>

      <ServicesDialog
        ref={servicesDialogRef}
        serviceGroups={serviceGroups}
        currentType={currentType}
        currentCategory={currentCategory}
        currentPeriod={currentPeriod}
        showLastUpdated={false}
      />
    </>
  );
}
