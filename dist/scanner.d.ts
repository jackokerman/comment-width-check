import type { Violation } from './types.js';
/**
 * It is the input needed to scan one source file's text.
 */
export type ScanTextOptions = {
    /**
     * Repo-relative file path used in diagnostics.
     */
    file: string;
    /**
     * Source text to scan.
     */
    text: string;
    /**
     * Maximum visual columns allowed for a comment line.
     */
    width: number;
    /**
     * Number of visual columns between tab stops.
     */
    tabWidth: number;
};
/**
 * It is the result from scanning one source file.
 */
export type ScanTextResult = {
    /**
     * Number of full-line comments checked.
     */
    linesChecked: number;
    /**
     * Over-width comment lines found during scanning.
     */
    violations: Violation[];
};
/**
 * Reports over-width full-line comments from one source file.
 */
export declare function scanText(options: ScanTextOptions): ScanTextResult;
/**
 * Returns true when a trimmed line is a standalone comment line.
 */
export declare function isCommentOnlyLine(trimmedLine: string): boolean;
/**
 * Returns true when a source file advertises itself as generated.
 */
export declare function isGeneratedFile(text: string): boolean;
