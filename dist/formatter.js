import { isGeneratedFile } from './scanner.js';
import { measureLineWidth } from './width.js';
const URL_PATTERN = /\b[a-z][a-z\d+.-]*:\/\/\S+/iu;
const DIRECTIVE_PATTERN = /^(?:\/?\s*)?(?:@ts-|ts-|eslint|oxlint|istanbul|c8|v8|prettier|biome|deno-lint|\/?\s*<reference)\b/iu;
const STRUCTURED_PATTERN = /^(?:[-*+]\s|\d+[.)]\s|[@#>|`])/u;
/**
 * Rewrites safe full-line prose comments to fit the configured print width.
 */
export function formatText(options) {
    if (isGeneratedFile(options.text)) {
        return { text: options.text, changed: false };
    }
    const lineEnding = options.text.includes('\r\n') ? '\r\n' : '\n';
    const lines = options.text.split(/\r?\n/u);
    const nextLines = [];
    let changed = false;
    for (let index = 0; index < lines.length; index++) {
        const block = parseBlockComment(lines, index);
        if (block !== undefined && isSafeProse(block.bodies)) {
            const replacement = wrapCommentParagraph({
                indent: block.indent,
                body: block.bodies.join(' '),
                width: options.width,
                tabWidth: options.tabWidth,
            });
            nextLines.push(...replacement);
            index = block.endIndex;
            changed = true;
            continue;
        }
        const lineComment = parseLineComment(lines[index] ?? '');
        if (lineComment === undefined || !isSafeProse([lineComment.body])) {
            nextLines.push(lines[index] ?? '');
            continue;
        }
        const group = [lineComment];
        let endIndex = index;
        while (endIndex + 1 < lines.length) {
            const next = parseLineComment(lines[endIndex + 1] ?? '');
            if (next === undefined ||
                next.indent !== lineComment.indent ||
                !isSafeProse([next.body])) {
                break;
            }
            group.push(next);
            endIndex++;
        }
        const original = lines.slice(index, endIndex + 1);
        const hasOverWidthLine = original.some((line) => measureLineWidth(line, options.tabWidth) > options.width);
        if (!hasOverWidthLine) {
            nextLines.push(...original);
            index = endIndex;
            continue;
        }
        const replacement = wrapCommentParagraph({
            indent: lineComment.indent,
            body: group.map((comment) => comment.body).join(' '),
            width: options.width,
            tabWidth: options.tabWidth,
        });
        nextLines.push(...replacement);
        index = endIndex;
        changed ||= !sameLines(original, replacement);
    }
    const formatted = nextLines.join(lineEnding);
    return { text: formatted, changed: changed && formatted !== options.text };
}
function parseLineComment(line) {
    const match = line.match(/^(\s*)\/\/(?!\/)\s?(.*)$/u);
    if (match === null) {
        return undefined;
    }
    const [, indent, body] = match;
    if (indent === undefined || body === undefined) {
        return undefined;
    }
    return { indent, body: body.trim() };
}
function parseBlockComment(lines, startIndex) {
    const firstLine = lines[startIndex];
    if (firstLine === undefined) {
        return undefined;
    }
    const singleLine = firstLine.match(/^(\s*)\/\*(?!\*)(.*?)\*\/\s*$/u);
    if (singleLine !== null) {
        const [, indent, body] = singleLine;
        return indent === undefined || body === undefined
            ? undefined
            : { indent, bodies: [body.trim()], endIndex: startIndex };
    }
    const start = firstLine.match(/^(\s*)\/\*(?!\*)\s*(.*?)\s*$/u);
    if (start === null) {
        return undefined;
    }
    const [, indent, firstBody] = start;
    if (indent === undefined || firstBody === undefined) {
        return undefined;
    }
    const bodies = firstBody.trim() === '' ? [] : [firstBody.trim()];
    for (let index = startIndex + 1; index < lines.length; index++) {
        const line = lines[index] ?? '';
        const escapedIndent = escapeRegExp(indent);
        if (new RegExp(`^${escapedIndent}\\s*\\*/\\s*$`, 'u').test(line)) {
            return { indent, bodies, endIndex: index };
        }
        const body = line.match(new RegExp(`^${escapedIndent}\\s*\\*\\s?(.*)$`, 'u'));
        if (body === null || body[1] === undefined) {
            return undefined;
        }
        bodies.push(body[1].trim());
    }
    return undefined;
}
function isSafeProse(bodies) {
    if (bodies.length === 0) {
        return false;
    }
    return bodies.every((body) => {
        return (body !== '' &&
            !URL_PATTERN.test(body) &&
            !DIRECTIVE_PATTERN.test(body) &&
            !STRUCTURED_PATTERN.test(body));
    });
}
function wrapCommentParagraph(options) {
    const prefix = `${options.indent}// `;
    const words = options.body.trim().split(/\s+/u);
    const lines = [];
    let current = prefix;
    for (const word of words) {
        const candidate = current === prefix ? `${prefix}${word}` : `${current} ${word}`;
        if (current !== prefix &&
            measureLineWidth(candidate, options.tabWidth) > options.width) {
            lines.push(current);
            current = `${prefix}${word}`;
            continue;
        }
        current = candidate;
    }
    lines.push(current);
    return lines;
}
function sameLines(a, b) {
    return a.length === b.length && a.every((line, index) => line === b[index]);
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}
