import { ExtractedNode } from './index';

export interface DesignSystem {
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

export function generateDesignTokens(uiTree: ExtractedNode): DesignSystem {
  const colorSet = new Set<string>();
  const fontSet = new Set<string>();

  function traverse(node: ExtractedNode) {
    if (node.styles) {
      if (node.styles.color) {
        colorSet.add(node.styles.color);
      }
      if (node.styles.backgroundColor) {
        colorSet.add(node.styles.backgroundColor);
      }
      if (node.styles.fontSize) {
        fontSet.add(node.styles.fontSize);
      }
    }
    
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        traverse(node.children[i]);
      }
    }
  }

  traverse(uiTree);

  const designSystem: DesignSystem = {
    colors: {},
    fonts: {}
  };

  let colorIndex = 1;
  for (const color of colorSet) {
    designSystem.colors[`color-${colorIndex++}`] = color;
  }

  let fontIndex = 1;
  for (const font of fontSet) {
    designSystem.fonts[`size-${fontIndex++}`] = font;
  }

  return designSystem;
}

export function sanitizeDOMTree(uiTree: ExtractedNode): ExtractedNode | null {
  const tag = uiTree.tagName.toLowerCase();
  if (tag === 'script' || tag === 'style' || tag === 'svg') {
    return null;
  }

  const newChildren: ExtractedNode[] = [];
  if (uiTree.children) {
    for (let i = 0; i < uiTree.children.length; i++) {
      const sanitizedChild = sanitizeDOMTree(uiTree.children[i]);
      if (sanitizedChild !== null) {
        newChildren.push(sanitizedChild);
      }
    }
  }

  return {
    ...uiTree,
    children: newChildren
  };
}
