/**
 * Formats checker results for human-oriented terminal output.
 */
export function formatTextResult(result) {
    if (result.violations.length === 0) {
        return `Checked ${result.filesChecked} files and ${result.linesChecked} comment lines. No comment width violations found.`;
    }
    const lines = result.violations.map((violation) => {
        return `${violation.file}:${violation.line}: comment is ${violation.columnWidth} columns, max is ${violation.maxWidth}\n  ${violation.text}`;
    });
    return [
        `Found ${result.violations.length} comment width violation${result.violations.length === 1 ? '' : 's'}.`,
        ...lines,
    ].join('\n');
}
