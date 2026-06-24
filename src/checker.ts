import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

import {findSourceFiles} from './files.js';
import {scanText} from './scanner.js';
import type {ResolvedOptions, ScanResult} from './types.js';

/**
 * Runs comment-width checks for all resolved source files.
 */
export async function runCheck(options: ResolvedOptions): Promise<ScanResult> {
	const files = await findSourceFiles(options.paths, options.cwd, options.ignore);
	const result: ScanResult = {
		filesChecked: 0,
		linesChecked: 0,
		violations: [],
	};

	for (const file of files) {
		const text = await readFile(join(options.cwd, file), 'utf8');
		const fileResult = scanText({
			file,
			text,
			width: options.width,
			tabWidth: options.tabWidth,
		});

		result.filesChecked++;
		result.linesChecked += fileResult.linesChecked;
		result.violations.push(...fileResult.violations);
	}

	return result;
}
