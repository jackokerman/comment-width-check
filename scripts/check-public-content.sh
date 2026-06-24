#!/usr/bin/env bash

set -euo pipefail

if ! command -v public-content-guard >/dev/null 2>&1; then
	exit 0
fi

public-content-guard --worktree \
	README.md \
	package.json \
	.releaserc.json \
	.github \
	src \
	scripts \
	oxlint.config.ts
