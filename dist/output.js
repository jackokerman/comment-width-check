/**
 * Formats checker results for human-oriented terminal output.
 */
export function formatTextResult(result) {
    if (result.violations.length === 0) {
        const changed = result.filesChanged > 0 ? ` Rewrote ${result.filesChanged} files.` : '';
        return `Checked ${result.filesChecked} files and ${result.linesChecked} comment lines.${changed} No comment width violations found.`;
    }
    const changed = result.filesChanged > 0 ? ` Rewrote ${result.filesChanged} files.` : '';
    const lines = result.violations.map((violation) => {
        if (violation.kind === 'format') {
            return `${violation.file}:${violation.line}: comment would be rewritten by --write\n  ${violation.text}`;
        }
        return `${violation.file}:${violation.line}: comment is ${violation.columnWidth} columns, max is ${violation.maxWidth}\n  ${violation.text}`;
    });
    return [
        `Found ${result.violations.length} comment violation${result.violations.length === 1 ? '' : 's'}.${changed}`,
        ...lines,
    ].join('\n');
}
