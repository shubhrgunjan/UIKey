import { ExtractedNode } from './index';
export interface DesignSystem {
    colors: Record<string, string>;
    fonts: Record<string, string>;
}
export declare function generateDesignTokens(uiTree: ExtractedNode): DesignSystem;
export declare function sanitizeDOMTree(uiTree: ExtractedNode): ExtractedNode | null;
