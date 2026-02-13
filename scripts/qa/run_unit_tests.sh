#!/usr/bin/env bash
set -euo pipefail

echo "[unit] Running unit tests"
if [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
  npm test -- --runInBand
elif [ -f "pyproject.toml" ] && command -v pytest >/dev/null 2>&1; then
  pytest -m "unit"
else
  echo "[unit] No unit test runner detected, executing QA policy self-check"
  test -f qa/config/release_review_gates.yaml
fi

echo "[unit] OK"
