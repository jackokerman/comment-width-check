# @jackokerman/comment-width-check

Checks and formats full-line JavaScript and TypeScript comments against the formatter's configured print width.

By default, it reports long comment-only lines while ignoring string literals, normal code, and trailing inline comments. With `--write`, it rewrites safe full-line prose comments before checking.

Check mode also reports safe comments that would be rewritten by `--write`, so CI can enforce comment formatting without mutating files.

## Install

```sh
bun add --dev @jackokerman/comment-width-check
```

The published CLI runs on Node.js 20 or newer.

## Usage

```sh
comment-width-check .
comment-width-check . --write
comment-width-check src --width 80 --tab-width 2
comment-width-check . --ignore 'completions/**' --format json
```

By default, the checker reads `printWidth` and `tabWidth` from local formatter config, then falls back to `80` columns and a tab width of `2`.

Supported config sources:

- `.oxfmtrc.json`
- `.prettierrc`
- `.prettierrc.json`
- `prettier.config.json`
- `package.json` `prettier` field

Only JSON config files are read. Use `--width` and `--tab-width` when a project uses a JavaScript formatter config.

## Policy

The checker scans JS and TS source files:

- `.js`
- `.jsx`
- `.ts`
- `.tsx`
- `.mjs`
- `.cjs`
- `.mts`
- `.cts`

It checks full-line comments whose trimmed text starts with `//`, `/*`, `/**`, `*`, or `*/`.

With `--write`, it formats only conservative cases:

- consecutive full-line `//` prose comment paragraphs
- plain full-line `/* ... */` or `/* ... */` prose blocks, converted to `//`

It leaves JSDoc comments to `oxfmt`'s `jsdoc` formatter.

It ignores:

- code lines with trailing comments
- comment lines containing URLs
- directive-like comments such as `// oxlint-disable`, `// @ts-expect-error`, or formatter/linter directives
- structured comment lines such as bullets, numbered lists, code fences, quote markers, or tag-style comments
- generated files with common generated markers near the top of the file

## Development

```sh
bun install
bun run check
```

Run a quick benchmark against one or more repos:

```sh
bun run bench -- /path/to/repo
```
