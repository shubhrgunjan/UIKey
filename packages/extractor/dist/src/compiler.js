"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDesignTokens = generateDesignTokens;
exports.sanitizeDOMTree = sanitizeDOMTree;
function generateDesignTokens(uiTree) {
    const colorSet = new Set();
    const fontSet = new Set();
    function traverse(node) {
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
    const designSystem = {
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
function sanitizeDOMTree(uiTree) {
    const tag = uiTree.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'svg') {
        return null;
    }
    const newChildren = [];
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
