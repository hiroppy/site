import {
  type ReactElement,
  type ReactNode,
  Children,
  isValidElement,
  useId,
} from "react";
import { MdCode } from "react-icons/md";
import { iconMap, type LanguageIconValues } from "../../utils/fileIcons";
import { CodeGroupInteraction } from "./CodeGroupInteraction";

type CodeGroupPanelProps = {
  "data-label": string;
  "data-icon"?: LanguageIconValues;
  "data-language"?: string;
};

type PanelData = {
  label: string;
  icon: LanguageIconValues;
  language: string;
  index: number;
};

type Props = {
  defaultTab?: string;
  children: ReactNode;
};

export function CodeGroup({ defaultTab, children }: Props) {
  const groupId = useId();
  const childArray = Children.toArray(children);
  const labeledChildren = childArray.filter(
    (child): child is ReactElement<CodeGroupPanelProps> =>
      isValidElement<CodeGroupPanelProps>(child) &&
      typeof child.props["data-label"] === "string",
  );

  const panels: PanelData[] = labeledChildren.map((child, index) => {
    const label = child.props["data-label"];
    const icon = child.props["data-icon"] ?? "file-code";
    const language = child.props["data-language"] ?? "default";

    return {
      label,
      icon,
      language,
      index,
    };
  });

  const defaultTabIndex = defaultTab
    ? panels.findIndex((panel) => panel.label === defaultTab)
    : -1;
  const normalizedActiveIndex =
    panels.length > 0
      ? Math.min(
          Math.max(defaultTabIndex >= 0 ? defaultTabIndex : 0, 0),
          panels.length - 1,
        )
      : 0;

  return (
    <div className="code-group" data-group-id={groupId}>
      <div
        className="code-group-tabs"
        role="tablist"
        aria-label="Code snippets"
      >
        {panels.map((panel) => {
          const IconComponent = iconMap[panel.icon] || MdCode;
          const isSelected = panel.index === normalizedActiveIndex;

          return (
            <button
              key={panel.index}
              className="code-group-tab"
              role="tab"
              aria-selected={isSelected ? "true" : "false"}
              data-index={panel.index}
              tabIndex={isSelected ? 0 : -1}
              id={`tab-${groupId}-${panel.index}`}
              aria-controls={`panel-${groupId}-${panel.index}`}
              type="button"
            >
              <span className="code-group-tab-icon">
                <IconComponent size={16} aria-hidden="true" focusable="false" />
              </span>
              <span className="code-group-tab-text">{panel.label}</span>
            </button>
          );
        })}
      </div>
      <div className="code-group-panels">
        {labeledChildren.map((child, index) => {
          const isActive = index === normalizedActiveIndex;

          return (
            <div
              key={`panel-${groupId}-${index}`}
              className="code-group-panel"
              role="tabpanel"
              aria-labelledby={`tab-${groupId}-${index}`}
              id={`panel-${groupId}-${index}`}
              style={{ display: isActive ? "block" : "none" }}
              data-label={child.props["data-label"]}
              data-icon={child.props["data-icon"]}
              data-language={child.props["data-language"]}
            >
              {child}
            </div>
          );
        })}
      </div>
      <CodeGroupInteraction
        groupId={groupId}
        panelCount={panels.length}
        defaultActiveIndex={normalizedActiveIndex}
      />
    </div>
  );
}
