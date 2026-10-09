"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIPrompt = generateAIPrompt;
function generateAIPrompt(designSystem, sanitizedTree) {
    let prompt = `# UI DESIGN SYSTEM INSTRUCTIONS\n`;
    prompt += `Adopt the following design tokens when generating UI components.\n\n`;
    prompt += `# Design Tokens\n`;
    prompt += `## Colors\n`;
    const reverseColorMap = {};
    for (const [key, value] of Object.entries(designSystem.colors)) {
        prompt += `- ${key}: ${value}\n`;
        reverseColorMap[value] = key;
    }
    prompt += `\n## Fonts\n`;
    const reverseFontMap = {};
    for (const [key, value] of Object.entries(designSystem.fonts)) {
        prompt += `- ${key}: ${value}\n`;
        reverseFontMap[value] = key;
    }
    prompt += `\n# UI Layout\n`;
    prompt += `Use the following structure for layout context:\n\n`;
    prompt += generatePseudoJSX(sanitizedTree, 0, reverseColorMap, reverseFontMap);
    return prompt;
}
function generatePseudoJSX(node, indent, reverseColorMap, reverseFontMap) {
    const pad = '  '.repeat(indent);
    const tag = node.tagName.toLowerCase();
    let attrs = '';
    if (node.id)
        attrs += ` id="${node.id}"`;
    if (node.styles) {
        const bg = node.styles.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            attrs += ` bg="${reverseColorMap[bg] || bg}"`;
        }
        const color = node.styles.color;
        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            attrs += ` color="${reverseColorMap[color] || color}"`;
        }
        const padding = node.styles.padding;
        if (padding && padding !== '0px') {
            attrs += ` p="${padding}"`;
        }
        const fs = node.styles.fontSize;
        if (fs) {
            attrs += ` fs="${reverseFontMap[fs] || fs}"`;
        }
    }
    if (!node.children || node.children.length === 0) {
        if (node.text) {
            return `${pad}<${tag}${attrs}>${node.text.trim()}</${tag}>\n`;
        }
        return `${pad}<${tag}${attrs} />\n`;
    }
    let result = `${pad}<${tag}${attrs}>\n`;
    if (node.text && node.text.trim()) {
        result += `${pad}  ${node.text.trim()}\n`;
    }
    for (let i = 0; i < node.children.length; i++) {
        result += generatePseudoJSX(node.children[i], indent + 1, reverseColorMap, reverseFontMap);
    }
    result += `${pad}</${tag}>\n`;
    return result;
}
