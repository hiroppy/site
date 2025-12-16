"use client";

import { useMemo, useState } from "react";
import { MdChevronRight, MdExpandMore } from "react-icons/md";
import { cn } from "../../utils/cn";

type Props = {
  className?: string;
  items: DirectoryTreeNode[] | string;
};

export function DirectoryTree({ className, items }: Props) {
  const parsedItems = useMemo(() => normalizeItems(items), [items]);

  if (parsedItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-gray-100/50 overflow-hidden",
        className,
      )}
    >
      <ul className="space-y-1 list-none pl-0">
        {parsedItems.map((node) => (
          <DirectoryTreeNodeItem key={node.id} node={node} depth={0} />
        ))}
      </ul>
    </div>
  );
}

type DirectoryTreeNode = {
  id: string;
  label: string;
  children?: DirectoryTreeNode[];
};

function DirectoryTreeNodeItem({
  node,
  depth,
}: {
  node: DirectoryTreeNode;
  depth: number;
}) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const [isOpen, setIsOpen] = useState(depth === 0);

  return (
    <li className="pl-0">
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1 text-sm",
          hasChildren ? "cursor-pointer" : "cursor-default",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.label}`}
            className="flex items-center justify-center rounded-md p-1 text-slate-400 transition"
          >
            {isOpen ? <MdExpandMore size={16} /> : <MdChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-6" />
        )}

        <span className="text-sm">{node.label}</span>
      </div>

      {hasChildren && isOpen && (
        <ul className="space-y-1 border-l-2 border-slate-700/60 pl-2 list-none ml-5">
          {node.children?.map((child) => (
            <DirectoryTreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function normalizeItems(
  items: DirectoryTreeNode[] | string,
): DirectoryTreeNode[] {
  if (typeof items === "string") {
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }

  return items;
}
