"use client";

import { useState } from "react";
import { Button } from "../../../../components/Button";
import { ListContainer } from "../../../../components/ListContainer";
import { SectionSubheading } from "./SectionSubheading";
import { SkillItem } from "./SkillItem";

type SkillItemType = {
  title: string;
  from: number;
  to?: number;
  maintainer?: boolean;
};

type Props = {
  currentYear: number;
  sections: {
    title: string;
    items: SkillItemType[];
    previewCount: number;
  }[];
};

export function SkillsSection({ currentYear, sections }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalHiddenItems = sections.reduce(
    (sum, section) =>
      sum + Math.max(0, section.items.length - section.previewCount),
    0,
  );

  return (
    <div>
      {/* Desktop */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2 xl:gap-12">
          {sections.map(({ title, items, previewCount }) => {
            const displayItems = isExpanded
              ? items
              : items.slice(0, previewCount);
            return (
              <div key={title}>
                <SectionSubheading as="h2">{title}</SectionSubheading>
                <ListContainer className="flex flex-col gap-3">
                  {displayItems.map(
                    ({ title: skillTitle, from, to, maintainer }) => (
                      <SkillItem
                        key={skillTitle}
                        title={skillTitle}
                        from={from}
                        to={to}
                        maintainer={maintainer}
                        currentYear={currentYear}
                      />
                    ),
                  )}
                </ListContainer>
              </div>
            );
          })}
        </div>
        {totalHiddenItems > 0 && (
          <div className="mt-8 flex justify-center">
            <ExpandButton
              isExpanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-10 xl:hidden">
        {sections.map(({ title, items, previewCount }) => (
          <IndividualSection
            key={title}
            title={title}
            items={items}
            previewCount={previewCount}
            currentYear={currentYear}
          />
        ))}
      </div>
    </div>
  );
}

function IndividualSection({
  title,
  items,
  previewCount,
  currentYear,
}: {
  title: string;
  items: SkillItemType[];
  previewCount: number;
  currentYear: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMore = items.length > previewCount;
  const displayItems = isExpanded ? items : items.slice(0, previewCount);

  return (
    <div>
      <SectionSubheading as="h2">{title}</SectionSubheading>
      <ListContainer className="flex flex-col gap-3">
        {displayItems.map(({ title: skillTitle, from, to, maintainer }) => (
          <SkillItem
            key={skillTitle}
            title={skillTitle}
            from={from}
            to={to}
            maintainer={maintainer}
            currentYear={currentYear}
          />
        ))}
      </ListContainer>
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <ExpandButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      )}
    </div>
  );
}

function ExpandButton({
  isExpanded,
  onClick,
}: {
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-expanded={isExpanded}
      className="px-6 py-2"
    >
      {isExpanded ? "Show less" : "Show more"}
    </Button>
  );
}
