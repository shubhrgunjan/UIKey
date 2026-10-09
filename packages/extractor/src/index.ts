function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function parseColor(color: string): [number, number, number, number] | null {
    const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (match) {
        return [
            parseInt(match[1]),
            parseInt(match[2]),
            parseInt(match[3]),
            match[4] ? parseFloat(match[4]) : 1
        ];
    }
    return null;
}

function checkContrast(fg: string, bg: string): boolean {
    const fgColor = parseColor(fg);
    const bgColor = parseColor(bg);
    if (!fgColor || !bgColor) return true; 
    if (bgColor[3] === 0 || fgColor[3] === 0) return true;

    const l1 = getLuminance(fgColor[0], fgColor[1], fgColor[2]);
    const l2 = getLuminance(bgColor[0], bgColor[1], bgColor[2]);
    
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio >= 4.5;
}

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
  accessibility?: {
    missingAriaLabel?: boolean;
    missingAltTag?: boolean;
    lowContrast?: boolean;
    issuesFound: string[];
  };
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

  const accessibility: NonNullable<ExtractedNode['accessibility']> = {
    issuesFound: []
  };

  const tagName = nodeData.tagName;

  if (tagName === 'img') {
    if (attributes['alt'] === undefined) {
      accessibility.missingAltTag = true;
      accessibility.issuesFound.push('Missing alt attribute on <img> tag');
      nodeData.attributes['alt'] = "Repaired: missing alt";
    }
  }

  const interactiveTags = ['button', 'a', 'input', 'textarea', 'select'];
  if (interactiveTags.includes(tagName)) {
    const hasAriaLabel = attributes['aria-label'] || attributes['aria-labelledby'] || attributes['title'];
    if (!hasAriaLabel) {
      let needsLabel = false;
      if (['input', 'textarea', 'select'].includes(tagName)) {
         needsLabel = true;
      } else if (!rootNode.textContent?.trim()) {
         needsLabel = true;
      }
      
      if (needsLabel) {
        accessibility.missingAriaLabel = true;
        accessibility.issuesFound.push(`Missing ARIA label on <${tagName}> tag`);
        nodeData.attributes['aria-label'] = `Repaired: missing aria-label for ${tagName}`;
      }
    }
  }

  const fg = computedStyle.color;
  const bg = computedStyle.backgroundColor;
  if (fg && bg) {
    if (!checkContrast(fg, bg)) {
      accessibility.lowContrast = true;
      accessibility.issuesFound.push('Low contrast between text and background');
    }
  }

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

  if (accessibility.issuesFound.length > 0) {
    nodeData.accessibility = accessibility;
  }

  return nodeData;
}

export * from './compiler';
export * from './formatter';
