import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const DEFAULT_WIDTH = 80;
const DEFAULT_TAB_WIDTH = 2;
const FORMATTER_CONFIG_FILES = [
    '.oxfmtrc.json',
    '.prettierrc',
    '.prettierrc.json',
    'prettier.config.json',
];
/**
 * Resolves CLI options and formatter defaults into concrete checker settings.
 */
export async function resolveOptions(options) {
    const formatterConfig = await readFormatterConfig(options.cwd);
    return {
        ...options,
        width: options.width ??
            numberConfigValue(formatterConfig?.printWidth) ??
            DEFAULT_WIDTH,
        tabWidth: options.tabWidth ??
            numberConfigValue(formatterConfig?.tabWidth) ??
            DEFAULT_TAB_WIDTH,
    };
}
/**
 * Reads the first supported formatter config file from a directory.
 */
export async function readFormatterConfig(cwd) {
    for (const file of FORMATTER_CONFIG_FILES) {
        const parsed = await readJsonFile(join(cwd, file));
        if (parsed !== undefined) {
            return parsed;
        }
    }
    const packageJson = await readJsonFile(join(cwd, 'package.json'));
    return packageJson?.prettier;
}
function numberConfigValue(value) {
    return typeof value === 'number' && Number.isFinite(value)
        ? value
        : undefined;
}
/**
 * Parses the requested output format.
 */
export function parseOutputFormat(value) {
    if (value === undefined || value === 'text') {
        return 'text';
    }
    if (value === 'json') {
        return 'json';
    }
    throw new Error(`Invalid --format value "${value}". Expected "text" or "json".`);
}
async function readJsonFile(path) {
    try {
        return JSON.parse(await readFile(path, 'utf8'));
    }
    catch (error) {
        if (error !== null &&
            typeof error === 'object' &&
            'code' in error &&
            error.code === 'ENOENT') {
            return undefined;
        }
        throw new Error(`Failed to read JSON config ${path}: ${String(error)}`, {
            cause: error,
        });
    }
}
