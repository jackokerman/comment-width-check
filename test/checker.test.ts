import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {describe, expect, test} from 'bun:test';

import {runCheck} from '../src/index.js';

describe('run_check', () => {
	test('reports comments that would be rewritten in check mode', async () => {
		const cwd = await tempDir();

		try {
			await writeFile(join(cwd, 'demo.ts'), '/* Use line comments here. */\n');

			const result = await runCheck({
				paths: ['.'],
				ignore: [],
				width: 80,
				tabWidth: 2,
				format: 'text',
				write: false,
				cwd,
			});

			expect(result.violations).toEqual([
				{
					kind: 'format',
					file: 'demo.ts',
					line: 1,
					columnWidth: 29,
					maxWidth: 80,
					text: '/* Use line comments here. */',
				},
			]);
		} finally {
			await rm(cwd, {force: true, recursive: true});
		}
	});

	test('rewrites comments before checking in write mode', async () => {
		const cwd = await tempDir();
		const path = join(cwd, 'demo.ts');

		try {
			await writeFile(path, '/* Use line comments here. */\n');

			const result = await runCheck({
				paths: ['.'],
				ignore: [],
				width: 80,
				tabWidth: 2,
				format: 'text',
				write: true,
				cwd,
			});

			expect(result.filesChanged).toBe(1);
			expect(result.violations).toEqual([]);
			expect(await readFile(path, 'utf8')).toBe('// Use line comments here.\n');
		} finally {
			await rm(cwd, {force: true, recursive: true});
		}
	});
});

async function tempDir(): Promise<string> {
	return await mkdtemp(join(tmpdir(), 'comment-width-check-'));
}
