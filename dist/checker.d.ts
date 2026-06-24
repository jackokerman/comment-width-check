import type { ResolvedOptions, ScanResult } from './types.js';
/**
 * Runs comment-width checks for all resolved source files.
 */
export declare function runCheck(options: ResolvedOptions): Promise<ScanResult>;
