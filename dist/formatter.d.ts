type FormatTextOptions = {
    text: string;
    width: number;
    tabWidth: number;
};
type FormatTextResult = {
    text: string;
    changed: boolean;
};
/**
 * Rewrites safe full-line prose comments to fit the configured print width.
 */
export declare function formatText(options: FormatTextOptions): FormatTextResult;
export {};
