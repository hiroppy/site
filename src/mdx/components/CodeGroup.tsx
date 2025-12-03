"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Icon } from "../../app/_components/Icon";

type Props = {
  defaultTab?: string;
  children: ReactNode;
};

type PanelData = {
  label: string;
  icon: string;
  language: string;
  index: number;
};

export default function CodeGroup({ defaultTab, children }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [panels, setPanels] = useState<PanelData[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);
  const groupId = useId();

  useEffect(() => {
    // Extract panel metadata from children
    const panelData: PanelData[] = [];
    const childArray = Array.isArray(children) ? children : [children];

    childArray.forEach((child) => {
      if (child?.props?.["data-label"]) {
        const label = child.props["data-label"];
        const icon = child.props["data-icon"] || "mdi:code-braces";
        const language = child.props["data-language"] || "default";

        panelData.push({
          label,
          icon,
          language,
          index: panelData.length,
        });
      }
    });

    setPanels(panelData);

    // Set initial active tab
    if (defaultTab) {
      const defaultIndex = panelData.findIndex((p) => p.label === defaultTab);
      if (defaultIndex !== -1) {
        setActiveIndex(defaultIndex);
      }
    }
  }, [children, defaultTab]);

  const switchToTab = (index: number) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let targetIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        targetIndex = currentIndex > 0 ? currentIndex - 1 : panels.length - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        targetIndex = currentIndex < panels.length - 1 ? currentIndex + 1 : 0;
        break;
      case "Home":
        e.preventDefault();
        targetIndex = 0;
        break;
      case "End":
        e.preventDefault();
        targetIndex = panels.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        switchToTab(currentIndex);
        return;
      default:
        return;
    }

    if (targetIndex !== currentIndex) {
      switchToTab(targetIndex);
      // Focus the target tab
      const tabs = tabsRef.current?.querySelectorAll(".code-group-tab");
      if (tabs) {
        (tabs[targetIndex] as HTMLElement)?.focus();
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const container = tabsRef.current;
    if (!container) return;

    const canScrollHorizontally = container.scrollWidth > container.clientWidth;

    if (e.deltaY !== 0 && canScrollHorizontally) {
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }
  };

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className="code-group" data-group-id={groupId}>
      <div
        className="code-group-tabs"
        role="tablist"
        ref={tabsRef}
        onWheel={handleWheel}
      >
        {panels.map((panel) => (
          <button
            key={panel.index}
            className="code-group-tab"
            role="tab"
            aria-selected={activeIndex === panel.index ? "true" : "false"}
            data-index={panel.index}
            tabIndex={activeIndex === panel.index ? 0 : -1}
            id={`tab-${groupId}-${panel.index}`}
            aria-controls={`panel-${groupId}-${panel.index}`}
            onClick={() => switchToTab(panel.index)}
            onKeyDown={(e) => handleKeyDown(e, panel.index)}
          >
            <span className="code-group-tab-icon">
              <Icon icon={panel.icon} width={16} height={16} />
            </span>
            <span className="code-group-tab-text">{panel.label}</span>
          </button>
        ))}
      </div>
      <div className="code-group-panels">
        {childArray.map((child: any, index: number) => {
          if (!child?.props?.["data-label"]) {
            return null;
          }

          return (
            <div
              key={index}
              className="code-group-panel"
              role="tabpanel"
              aria-labelledby={`tab-${groupId}-${index}`}
              id={`panel-${groupId}-${index}`}
              style={{ display: activeIndex === index ? "block" : "none" }}
              data-label={child.props["data-label"]}
              data-icon={child.props["data-icon"]}
              data-language={child.props["data-language"]}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}
