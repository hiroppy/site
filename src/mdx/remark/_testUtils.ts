import type { RootContent } from "mdast";

type MdxjsEsm = Extract<RootContent, { type: "mdxjsEsm" }>;
type MdxJsxFlowElement = Extract<RootContent, { type: "mdxJsxFlowElement" }>;
type MdxJsxAttribute = Extract<
  MdxJsxFlowElement["attributes"][number],
  { type: "mdxJsxAttribute" }
>;

export function isMdxEsm(node: RootContent): node is MdxjsEsm {
  return node.type === "mdxjsEsm";
}

export function findMdxEsmNodes(children: RootContent[]): MdxjsEsm[] {
  return children.filter(isMdxEsm);
}

export function getMdxEsmNode(node: RootContent): MdxjsEsm {
  if (!isMdxEsm(node)) {
    throw new Error(`Expected mdxjsEsm node, received ${node.type}`);
  }
  return node;
}

function isMdxComponent(
  node: RootContent,
  name: string,
): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement" && node.name === name;
}

export function findMdxComponent(
  children: RootContent[],
  name: string,
): MdxJsxFlowElement | undefined {
  return children.find((child) => isMdxComponent(child, name));
}

export function getMdxComponent(
  children: RootContent[],
  name: string,
): MdxJsxFlowElement {
  const component = findMdxComponent(children, name);
  if (!component) {
    throw new Error(`Expected MDX component ${name} to exist`);
  }
  return component;
}

export function findMdxComponents(
  children: RootContent[],
  name: string,
): MdxJsxFlowElement[] {
  return children.filter((child) => isMdxComponent(child, name));
}

export function hasMdxComponent(
  children: RootContent[],
  name: string,
): boolean {
  return findMdxComponent(children, name) !== undefined;
}

export function getAttr(
  component: MdxJsxFlowElement,
  name: string,
): string | null | undefined {
  const attr = component.attributes.find(
    (attribute): attribute is MdxJsxAttribute =>
      attribute.type === "mdxJsxAttribute" && attribute.name === name,
  );

  const value = attr?.value;
  return typeof value === "string" || value == null ? value : undefined;
}

export function getStringAttr(
  component: MdxJsxFlowElement,
  name: string,
): string {
  const value = getAttr(component, name);
  if (typeof value !== "string") {
    throw new Error(`Expected ${component.name}.${name} to be a string`);
  }
  return value;
}
