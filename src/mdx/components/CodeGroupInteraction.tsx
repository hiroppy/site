"use client";

import { useEffect } from "react";

type Props = {
  groupId: string;
  panelCount: number;
  defaultActiveIndex: number;
};

export function CodeGroupInteraction({
  groupId,
  panelCount,
  defaultActiveIndex,
}: Props) {
  useEffect(() => {
    const root = document.querySelector(`[data-group-id="${groupId}"]`);
    if (!root || panelCount === 0) {
      return;
    }

    const tabsContainer =
      root.querySelector<HTMLDivElement>(".code-group-tabs");
    if (!tabsContainer) {
      return;
    }

    const panelsContainer =
      root.querySelector<HTMLDivElement>(".code-group-panels");

    const tabs = Array.from(
      tabsContainer.querySelectorAll<HTMLButtonElement>(".code-group-tab"),
    );
    const panels = Array.from(
      panelsContainer?.querySelectorAll<HTMLDivElement>(
        ":scope > .code-group-panel",
      ) ?? [],
    );
    if (tabs.length === 0 || panels.length === 0) {
      return;
    }

    let activeIndex = Math.min(
      Math.max(defaultActiveIndex, 0),
      tabs.length - 1,
    );

    const updateActiveTab = (nextIndex: number, shouldFocus: boolean) => {
      const clampedIndex = Math.min(Math.max(nextIndex, 0), tabs.length - 1);
      activeIndex = clampedIndex;

      tabs.forEach((tab, idx) => {
        const selected = idx === clampedIndex;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.tabIndex = selected ? 0 : -1;
        if (selected && shouldFocus) {
          tab.focus();
        }
      });

      panels.forEach((panel, idx) => {
        panel.style.display = idx === clampedIndex ? "block" : "none";
      });
    };

    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        ".code-group-tab",
      ) as HTMLButtonElement | null;
      if (!target) {
        return;
      }

      const indexAttr = target.getAttribute("data-index");
      if (indexAttr === null) {
        return;
      }

      const index = Number(indexAttr);
      if (Number.isNaN(index)) {
        return;
      }

      updateActiveTab(index, false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        ".code-group-tab",
      ) as HTMLButtonElement | null;
      if (!target) {
        return;
      }

      let targetIndex = activeIndex;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          targetIndex = activeIndex > 0 ? activeIndex - 1 : tabs.length - 1;
          break;
        case "ArrowRight":
          event.preventDefault();
          targetIndex = activeIndex < tabs.length - 1 ? activeIndex + 1 : 0;
          break;
        case "Home":
          event.preventDefault();
          targetIndex = 0;
          break;
        case "End":
          event.preventDefault();
          targetIndex = tabs.length - 1;
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          updateActiveTab(activeIndex, true);
          return;
        default:
          return;
      }

      if (targetIndex !== activeIndex) {
        updateActiveTab(targetIndex, true);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!tabsContainer) {
        return;
      }

      const canScrollHorizontally =
        tabsContainer.scrollWidth > tabsContainer.clientWidth;

      if (event.deltaY !== 0 && canScrollHorizontally) {
        if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          event.preventDefault();
          tabsContainer.scrollLeft += event.deltaY;
        }
      }
    };

    updateActiveTab(activeIndex, false);

    tabsContainer.addEventListener("click", handleClick);
    tabsContainer.addEventListener("keydown", handleKeyDown);
    tabsContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      tabsContainer.removeEventListener("click", handleClick);
      tabsContainer.removeEventListener("keydown", handleKeyDown);
      tabsContainer.removeEventListener("wheel", handleWheel as EventListener);
    };
  }, [groupId, panelCount, defaultActiveIndex]);

  return null;
}
