export interface ExtractedNode {
  tagName: string;
  id: string;
  className: string;
  text?: string;
  attributes: Record<string, string>;
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  styles: {
    backgroundColor: string;
    color: string;
    padding: string;
    fontSize: string;
  };
  children: ExtractedNode[];
}

export function extractDOM(rootNode: HTMLElement): ExtractedNode {
  const rect = rootNode.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(rootNode);

  const attributes: Record<string, string> = {};
  for (let i = 0; i < rootNode.attributes.length; i++) {
    const attr = rootNode.attributes[i];
    attributes[attr.name] = attr.value;
  }

  const nodeData: ExtractedNode = {
    tagName: rootNode.tagName.toLowerCase(),
    id: rootNode.id,
    className: rootNode.className,
    attributes,
    geometry: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    },
    styles: {
      backgroundColor: computedStyle.backgroundColor,
      color: computedStyle.color,
      padding: computedStyle.padding,
      fontSize: computedStyle.fontSize,
    },
    children: [],
  };

  if (rootNode.childNodes.length > 0) {
    let textContent = "";
    for (let i = 0; i < rootNode.childNodes.length; i++) {
      const child = rootNode.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE) {
        textContent += child.textContent || "";
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        nodeData.children.push(extractDOM(child as HTMLElement));
      }
    }
    const trimmedText = textContent.trim();
    if (trimmedText) {
      nodeData.text = trimmedText;
    }
  }

  return nodeData;
}

export * from './compiler';
export * from './formatter';
