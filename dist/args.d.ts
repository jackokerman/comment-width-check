import type { CheckerOptions } from './types.js';
/**
 * Parses command-line arguments for the checker CLI.
 */
export declare function parseArgs(argv: string[], cwd?: string): CheckerOptions;
/**
 * It signals that the user requested CLI help output.
 */
export declare class HelpRequested extends Error {
}
