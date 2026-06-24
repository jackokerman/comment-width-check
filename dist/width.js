import stringWidth from 'string-width';
/**
 * Measures a line's visual column width using the configured tab width.
 */
export function measureLineWidth(line, tabWidth) {
    let columns = 0;
    for (const char of line) {
        if (char === '\t') {
            columns += tabWidth - (columns % tabWidth);
            continue;
        }
        columns += stringWidth(char);
    }
    return columns;
}
