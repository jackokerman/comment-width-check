import type {Stats} from 'node:fs';
import {stat} from 'node:fs/promises';
import {relative, resolve} from 'node:path';

import {glob} from 'tinyglobby';

const SOURCE_EXTENSIONS = new Set([
	'.cjs',
	'.cts',
	'.js',
	'.jsx',
	'.mjs',
	'.mts',
	'.ts',
	'.tsx',
]);

/**
 * Expands CLI paths into source files relative to the current working directory.
 */
export async function findSourceFiles(
	paths: string[],
	cwd: string,
	ignore: string[],
): Promise<string[]> {
	const inputs = paths.length > 0 ? paths : ['.'];
	const files = new Set<string>();

	for (const input of inputs) {
		const absoluteInput = resolve(cwd, input);
		const inputStat = await statIfExists(absoluteInput);

		if (inputStat?.isFile()) {
			const relativeFile = toPosixPath(relative(cwd, absoluteInput));

			if (isSourceFile(relativeFile)) {
				files.add(relativeFile);
			}

			continue;
		}

		const patterns = inputStat?.isDirectory()
			? [`${toPosixPath(input)}/**/*`]
			: [input];

		const matches = await glob(patterns, {
			cwd,
			dot: true,
			ignore: ['node_modules/**', 'dist/**', ...ignore],
			onlyFiles: true,
		});

		for (const match of matches) {
			const normalized = toPosixPath(match);

			if (isSourceFile(normalized)) {
				files.add(normalized);
			}
		}
	}

	return [...files].toSorted();
}

function isSourceFile(path: string): boolean {
	const dotIndex = path.lastIndexOf('.');

	if (dotIndex === -1) {
		return false;
	}

	return SOURCE_EXTENSIONS.has(path.slice(dotIndex));
}

async function statIfExists(path: string): Promise<Stats | null> {
	try {
		return await stat(path);
	} catch (error) {
		if (
			error !== null &&
			typeof error === 'object' &&
			'code' in error &&
			error.code === 'ENOENT'
		) {
			return null;
		}

		throw error;
	}
}

function toPosixPath(path: string): string {
	return path.replaceAll('\\', '/');
}
