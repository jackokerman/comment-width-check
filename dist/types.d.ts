/**
 * It is the supported terminal output shape.
 */
export type OutputFormat = 'text' | 'json';
/**
 * It is the unchecked CLI and API input before formatter config defaults apply.
 */
export type CheckerOptions = {
    /**
     * Source paths, directories, or glob patterns to scan.
     */
    paths: string[];
    /**
     * Glob patterns to exclude from scanning.
     */
    ignore: string[];
    /**
     * Maximum visual columns allowed for a comment line.
     */
    width?: number;
    /**
     * Number of visual columns between tab stops.
     */
    tabWidth?: number;
    /**
     * Output format for checker results.
     */
    format: OutputFormat;
    /**
     * Whether to rewrite safe over-width line comments before checking.
     */
    write: boolean;
    /**
     * Directory used for path expansion and formatter config discovery.
     */
    cwd: string;
};
/**
 * It is the concrete checker configuration after defaults are resolved.
 */
export type ResolvedOptions = {
    /**
     * Source paths, directories, or glob patterns to scan.
     */
    paths: string[];
    /**
     * Glob patterns to exclude from scanning.
     */
    ignore: string[];
    /**
     * Maximum visual columns allowed for a comment line.
     */
    width: number;
    /**
     * Number of visual columns between tab stops.
     */
    tabWidth: number;
    /**
     * Output format for checker results.
     */
    format: OutputFormat;
    /**
     * Whether to rewrite safe over-width line comments before checking.
     */
    write: boolean;
    /**
     * Directory used for path expansion and formatter config discovery.
     */
    cwd: string;
};
/**
 * It describes one over-width comment line.
 */
export type Violation = {
    /**
     * Whether the comment exceeds width or needs formatter rewriting.
     */
    kind: 'format' | 'width';
    /**
     * Repo-relative file path.
     */
    file: string;
    /**
     * One-based line number.
     */
    line: number;
    /**
     * Measured visual column width for the line.
     */
    columnWidth: number;
    /**
     * Maximum allowed visual column width.
     */
    maxWidth: number;
    /**
     * Trimmed comment line text for diagnostics.
     */
    text: string;
};
/**
 * It is the aggregate result from one checker run.
 */
export type ScanResult = {
    /**
     * Number of source files scanned.
     */
    filesChecked: number;
    /**
     * Number of source files rewritten.
     */
    filesChanged: number;
    /**
     * Number of full-line comments checked.
     */
    linesChecked: number;
    /**
     * Over-width comment lines found during scanning.
     */
    violations: Violation[];
};
