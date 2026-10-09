"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDOM = extractDOM;
function extractDOM(rootNode) {
    const rect = rootNode.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(rootNode);
    const attributes = {};
    for (let i = 0; i < rootNode.attributes.length; i++) {
        const attr = rootNode.attributes[i];
        attributes[attr.name] = attr.value;
    }
    const nodeData = {
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
            }
            else if (child.nodeType === Node.ELEMENT_NODE) {
                nodeData.children.push(extractDOM(child));
            }
        }
        const trimmedText = textContent.trim();
        if (trimmedText) {
            nodeData.text = trimmedText;
        }
    }
    return nodeData;
}
__exportStar(require("./compiler"), exports);
__exportStar(require("./formatter"), exports);
