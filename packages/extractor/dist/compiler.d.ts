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
export declare function extractAnimations(node: any): string[];
export declare function extractTheme(doc: any): {
    light: Record<string, string>;
    dark: Record<string, string>;
};
export declare function generateDesignTokens(uiTree: ExtractedNode): DesignSystem;
export declare function sanitizeDOMTree(uiTree: ExtractedNode): ExtractedNode | null;
