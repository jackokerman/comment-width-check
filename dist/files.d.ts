/**
 * Expands CLI paths into source files relative to the current working directory.
 */
export declare function findSourceFiles(paths: string[], cwd: string, ignore: string[]): Promise<string[]>;
