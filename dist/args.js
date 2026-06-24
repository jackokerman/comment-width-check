import { parseOutputFormat } from './config.js';
/**
 * Parses command-line arguments for the checker CLI.
 */
export function parseArgs(argv, cwd = process.cwd()) {
    const paths = [];
    const ignore = [];
    let width;
    let tabWidth;
    let format = parseOutputFormat(undefined);
    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index];
        if (arg === undefined) {
            break;
        }
        if (arg === '--help' || arg === '-h') {
            throw new HelpRequested();
        }
        if (arg === '--width') {
            width = parsePositiveInteger(readOptionValue(argv, ++index, '--width'));
            continue;
        }
        if (arg === '--tab-width') {
            tabWidth = parsePositiveInteger(readOptionValue(argv, ++index, '--tab-width'));
            continue;
        }
        if (arg === '--ignore') {
            ignore.push(readOptionValue(argv, ++index, '--ignore'));
            continue;
        }
        if (arg === '--format') {
            format = parseOutputFormat(readOptionValue(argv, ++index, '--format'));
            continue;
        }
        if (arg.startsWith('-')) {
            throw new Error(`Unknown option "${arg}".`);
        }
        paths.push(arg);
    }
    return { paths, ignore, width, tabWidth, format, cwd };
}
/**
 * It signals that the user requested CLI help output.
 */
export class HelpRequested extends Error {
}
function readOptionValue(argv, index, option) {
    const value = argv[index];
    if (value === undefined || value.startsWith('-')) {
        throw new Error(`Missing value for ${option}.`);
    }
    return value;
}
function parsePositiveInteger(value) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`Expected a positive integer, got "${value}".`);
    }
    return parsed;
}
