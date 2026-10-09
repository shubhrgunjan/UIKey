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
export declare function extractDOM(rootNode: HTMLElement): ExtractedNode;
export * from './compiler';
export * from './formatter';
