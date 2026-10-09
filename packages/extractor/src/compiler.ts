import { ExtractedNode } from './index';

export interface DesignSystem {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  animations: string[];
  themes: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export function extractAnimations(node: any): string[] {
  const classes: string[] = [];
  if (node && node.styles) {
    const transition = node.styles.transition;
    if (transition && transition !== 'none' && transition !== '') {
      classes.push('transition-all');
      classes.push('duration-300');
    }
    const animation = node.styles.animation;
    if (animation && animation !== 'none' && animation !== '') {
      classes.push('animate-pulse');
    }
  }
  return classes;
}

export function extractTheme(doc: any): { light: Record<string, string>, dark: Record<string, string> } {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  
  // Checks for dark mode CSS variables
  if (doc && doc.styleSheets) {
    try {
      for (const sheet of doc.styleSheets) {
        for (const rule of sheet.cssRules) {
          if (rule.type === 1 && rule.selectorText === ':root') {
            // Extract variables
          }
        }
      }
    } catch (e) {
      // Ignore cross-origin stylesheet errors
    }
  }
  return { light, dark };
}

export function generateDesignTokens(uiTree: ExtractedNode): DesignSystem {
  const colorSet = new Set<string>();
  const fontSet = new Set<string>();
  const animationsSet = new Set<string>();

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
      
      const anims = extractAnimations(node);
      for (const a of anims) {
        animationsSet.add(a);
      }
    }
    
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        traverse(node.children[i]);
      }
    }
  }

  traverse(uiTree);

  // In a real browser environment, doc would be document
  const doc = typeof document !== 'undefined' ? document : null;

  const designSystem: DesignSystem = {
    colors: {},
    fonts: {},
    animations: Array.from(animationsSet),
    themes: extractTheme(doc)
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
