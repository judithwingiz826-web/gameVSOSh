#!/usr/bin/env bash
set -euo pipefail

echo "[lint] Running markdown lint checks"
if command -v markdownlint >/dev/null 2>&1; then
  markdownlint '**/*.md'
else
  echo "[lint] markdownlint not installed, using fallback check"
  if rg -n "\t" Docs .github qa scripts >/dev/null 2>&1; then
    echo "[lint] Tabs found in tracked QA/docs files"
    rg -n "\t" Docs .github qa scripts
    exit 1
  fi
fi

echo "[lint] OK"
