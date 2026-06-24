import {resolve} from 'node:path';
import {performance} from 'node:perf_hooks';

import {resolveOptions,runCheck} from '../src/index.js';

const paths = process.argv.slice(2);

if (paths.length === 0) {
	console.error('Usage: bun run bench -- /path/to/repo [...]');
	process.exit(2);
}

for (const path of paths) {
	const cwd = resolve(path);
	const options = await resolveOptions({
		paths: ['.'],
		ignore: [],
		format: 'json',
		write: false,
		cwd,
	});
	const start = performance.now();
	const result = await runCheck(options);
	const elapsedMs = performance.now() - start;

	console.log(
		JSON.stringify(
			{
				cwd,
				elapsedMs: Math.round(elapsedMs),
				filesChecked: result.filesChecked,
				linesChecked: result.linesChecked,
				violations: result.violations.length,
			},
			null,
			2,
		),
	);
}
