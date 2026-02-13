#!/usr/bin/env bash
set -euo pipefail

echo "[smoke] Running scene/menu smoke tests"
if [ -f "scenes/index.json" ] && command -v jq >/dev/null 2>&1; then
  jq -e '.menus and .scenes' scenes/index.json >/dev/null
else
  echo "[smoke] No parseable scene registry detected, validating smoke test manifest"
  test -f qa/config/smoke_test_manifest.yaml
fi

echo "[smoke] OK"
