#!/usr/bin/env node
import {HelpRequested,parseArgs} from './args.js';
import {runCheck} from './checker.js';
import {resolveOptions} from './config.js';
import {formatTextResult} from './output.js';

const HELP = `Usage: comment-width-check [paths...] [options]

Options:
  --width <n>       Max visual column width.
  --tab-width <n>   Tab expansion width.
  --ignore <glob>   Ignore glob. Can be repeated.
  --format <value>  Output format: text or json.
  --write           Rewrite safe prose comments before checking.
  -h, --help        Show help.
`;

async function main(): Promise<number> {
	try {
		const cliOptions = parseArgs(process.argv.slice(2));
		const options = await resolveOptions(cliOptions);
		const result = await runCheck(options);

		if (options.format === 'json') {
			console.log(JSON.stringify(result, null, 2));
		} else {
			console.log(formatTextResult(result));
		}

		return result.violations.length > 0 ? 1 : 0;
	} catch (error) {
		if (error instanceof HelpRequested) {
			console.log(HELP);
			return 0;
		}

		const message = error instanceof Error ? error.message : String(error);
		console.error(`comment-width-check: ${message}`);
		return 2;
	}
}

process.exitCode = await main();
