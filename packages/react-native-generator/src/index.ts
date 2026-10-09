export function generateReactNative(uikeyManifest: any): string {
  let styleCounter = 0;
  const stylesObj: Record<string, any> = {};

  function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  function processTokens(tokens: any, style: any) {
    if (!tokens || !style) return style;
    const resolvedStyle: Record<string, any> = {};
    for (const key in style) {
      const camelKey = toCamelCase(key);
      let value = style[key];

      if (typeof value === 'string' && value.startsWith('$')) {
        const tokenPath = value.substring(1).split('.');
        let current = tokens;
        for (const p of tokenPath) {
          if (current && current[p] !== undefined) {
            current = current[p];
          } else {
            current = undefined;
            break;
          }
        }
        if (current !== undefined) {
          value = current;
        }
      }

      // Convert "px" string values to numbers if applicable in React Native (for flex, padding, etc)
      if (typeof value === 'string' && value.endsWith('px')) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          value = num;
        }
      }

      resolvedStyle[camelKey] = value;
    }
    return resolvedStyle;
  }

  function processNode(node: any, tokens?: any): string {
    if (!node) return '';

    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }

    const type = node.type || 'View';
    const rawStyles = node.style || node.styles || {};
    const styles = processTokens(tokens, rawStyles);
    const children = node.children || node.layout;
    
    let styleProp = '';
    
    if (Object.keys(styles).length > 0) {
      const styleName = `${type.toLowerCase()}_${styleCounter++}`;
      stylesObj[styleName] = styles;
      styleProp = ` style={styles.${styleName}}`;
    }

    let childrenStr = '';
    if (Array.isArray(children)) {
      childrenStr = children.map((child: any) => processNode(child, tokens)).join('\n      ');
    } else if (children && typeof children === 'object') {
      childrenStr = processNode(children, tokens);
    } else if (children) {
      childrenStr = String(children);
    }

    if (!childrenStr) {
      return `<${type}${styleProp} />`;
    }

    return `<${type}${styleProp}>
      ${childrenStr}
    </${type}>`;
  }

  const tokens = uikeyManifest.designTokens || uikeyManifest.tokens || {};
  const root = uikeyManifest.layout || uikeyManifest.root || uikeyManifest;

  const componentBody = processNode(root, tokens);

  const stylesString = Object.keys(stylesObj).length > 0
    ? Object.entries(stylesObj)
        .map(([key, value]) => `  ${key}: ${JSON.stringify(value, null, 4).replace(/\n/g, '\n  ')}`)
        .join(',\n')
    : '';

  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GeneratedComponent() {
  return (
    ${componentBody.trim().replace(/\n/g, '\n    ')}
  );
}

const styles = StyleSheet.create({
${stylesString}
});
`;
}
