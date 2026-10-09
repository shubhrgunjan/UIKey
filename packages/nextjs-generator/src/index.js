"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNextPage = generateNextPage;
function generateNextPage(uikeyManifest) {
    function processNode(node, indentLevel = 4) {
        const { tagName, id, className, text, attributes, children, styles } = node;
        let tailwindClasses = className ? className.split(' ').filter(Boolean) : [];
        if (styles) {
            if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent') {
                const color = styles.backgroundColor.replace(/\s+/g, '');
                tailwindClasses.push(`bg-[${color}]`);
            }
            if (styles.color && styles.color !== 'rgba(0, 0, 0, 0)' && styles.color !== 'transparent') {
                const color = styles.color.replace(/\s+/g, '');
                tailwindClasses.push(`text-[${color}]`);
            }
            if (styles.padding && styles.padding !== '0px') {
                tailwindClasses.push(`p-[${styles.padding}]`);
            }
            if (styles.fontSize && styles.fontSize !== '16px') {
                tailwindClasses.push(`text-[${styles.fontSize}]`);
            }
        }
        const clsString = tailwindClasses.length > 0 ? ` className="${tailwindClasses.join(' ')}"` : '';
        const idString = id ? ` id="${id}"` : '';
        let attrString = '';
        if (attributes) {
            for (const [key, value] of Object.entries(attributes)) {
                if (key === 'class' || key === 'id' || key === 'style')
                    continue;
                let reactKey = key;
                if (key === 'for')
                    reactKey = 'htmlFor';
                if (key === 'tabindex')
                    reactKey = 'tabIndex';
                // Convert kebab-case attributes to camelCase except data- and aria-
                if (key.includes('-') && !key.startsWith('data-') && !key.startsWith('aria-')) {
                    reactKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                }
                const safeValue = String(value).replace(/"/g, '&quot;');
                attrString += ` ${reactKey}="${safeValue}"`;
            }
        }
        const tag = tagName || 'div';
        const indent = ' '.repeat(indentLevel);
        const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        if (voidElements.includes(tag)) {
            return `${indent}<${tag}${idString}${clsString}${attrString} />`;
        }
        let innerContent = '';
        if (text) {
            innerContent += text;
        }
        if (children && children.length > 0) {
            const childrenString = children.map((c) => processNode(c, indentLevel + 2)).join('\n');
            innerContent += (text ? '\n' : '') + '\n' + childrenString + '\n' + indent;
        }
        if (!innerContent) {
            return `${indent}<${tag}${idString}${clsString}${attrString}></${tag}>`;
        }
        return `${indent}<${tag}${idString}${clsString}${attrString}>\n${indent}  ${innerContent.trim()}\n${indent}</${tag}>`;
    }
    let body = '';
    if (uikeyManifest) {
        body = processNode(uikeyManifest).trim();
    }
    return `import React from 'react';

export default function NextPage() {
  return (
    ${body}
  );
}
`;
}
//# sourceMappingURL=index.js.map