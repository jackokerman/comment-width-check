import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

import {findSourceFiles} from './files.js';
import {formatText} from './formatter.js';
import {scanText} from './scanner.js';
import type {ResolvedOptions, ScanResult} from './types.js';
import {measureLineWidth} from './width.js';

/**
 * Runs comment-width checks for all resolved source files.
 */
export async function runCheck(options: ResolvedOptions): Promise<ScanResult> {
	const files = await findSourceFiles(options.paths, options.cwd, options.ignore);
	const result: ScanResult = {
		filesChecked: 0,
		filesChanged: 0,
		linesChecked: 0,
		violations: [],
	};

	for (const file of files) {
		const path = join(options.cwd, file);
		let text = await readFile(path, 'utf8');

		const formatted = formatText({
			text,
			width: options.width,
			tabWidth: options.tabWidth,
		});

		if (options.write) {
			if (formatted.changed) {
				await writeFile(path, formatted.text);
				text = formatted.text;
				result.filesChanged++;
			}
		}

		const fileResult = scanText({
			file,
			text,
			width: options.width,
			tabWidth: options.tabWidth,
		});

		result.filesChecked++;
		result.linesChecked += fileResult.linesChecked;
		result.violations.push(...fileResult.violations);

		if (!options.write && formatted.changed) {
			const changedLine = firstChangedLine(text, formatted.text);

			if (
				changedLine !== undefined &&
				!fileResult.violations.some(
					(violation) => violation.line === changedLine.line,
				)
			) {
				result.violations.push({
					kind: 'format',
					file,
					line: changedLine.line,
					columnWidth: measureLineWidth(changedLine.text, options.tabWidth),
					maxWidth: options.width,
					text: changedLine.text.trim(),
				});
			}
		}
	}

	return result;
}

function firstChangedLine(
	before: string,
	after: string,
): {line: number; text: string} | undefined {
	const beforeLines = before.split(/\r?\n/u);
	const afterLines = after.split(/\r?\n/u);
	const length = Math.max(beforeLines.length, afterLines.length);

	for (let index = 0; index < length; index++) {
		if (beforeLines[index] !== afterLines[index]) {
			return {line: index + 1, text: beforeLines[index] ?? ''};
		}
	}

	return undefined;
}
