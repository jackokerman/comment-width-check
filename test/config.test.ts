import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {describe, expect, test} from 'bun:test';

import {parseArgs, readFormatterConfig, resolveOptions} from '../src/index.js';

describe('parse_args', () => {
	test('parses paths and options', () => {
		expect(
			parseArgs(
				[
					'src',
					'--width',
					'100',
					'--tab-width',
					'4',
					'--ignore',
					'generated/**',
					'--format',
					'json',
				],
				'/repo',
			),
		).toEqual({
			paths: ['src'],
			ignore: ['generated/**'],
			width: 100,
			tabWidth: 4,
			format: 'json',
			cwd: '/repo',
		});
	});
});

describe('formatter_config', () => {
	test('reads oxfmt config', async () => {
		const cwd = await tempDir();

		try {
			await writeFile(
				join(cwd, '.oxfmtrc.json'),
				JSON.stringify({printWidth: 88, tabWidth: 4}),
			);

			expect(await readFormatterConfig(cwd)).toEqual({
				printWidth: 88,
				tabWidth: 4,
			});
		} finally {
			await rm(cwd, {force: true, recursive: true});
		}
	});

	test('uses cli options before config values', async () => {
		const cwd = await tempDir();

		try {
			await writeFile(
				join(cwd, '.oxfmtrc.json'),
				JSON.stringify({printWidth: 88, tabWidth: 4}),
			);

			expect(
				await resolveOptions({
					paths: ['.'],
					ignore: [],
					width: 100,
					tabWidth: undefined,
					format: 'text',
					cwd,
				}),
			).toEqual({
				paths: ['.'],
				ignore: [],
				width: 100,
				tabWidth: 4,
				format: 'text',
				cwd,
			});
		} finally {
			await rm(cwd, {force: true, recursive: true});
		}
	});
});

async function tempDir(): Promise<string> {
	return await mkdtemp(join(tmpdir(), 'comment-width-check-'));
}
