import type { CheckerOptions, OutputFormat, ResolvedOptions } from './types.js';
type FormatterConfig = {
    printWidth?: unknown;
    tabWidth?: unknown;
};
/**
 * Resolves CLI options and formatter defaults into concrete checker settings.
 */
export declare function resolveOptions(options: CheckerOptions): Promise<ResolvedOptions>;
/**
 * Reads the first supported formatter config file from a directory.
 */
export declare function readFormatterConfig(cwd: string): Promise<FormatterConfig | undefined>;
/**
 * Parses the requested output format.
 */
export declare function parseOutputFormat(value: string | undefined): OutputFormat;
export {};
