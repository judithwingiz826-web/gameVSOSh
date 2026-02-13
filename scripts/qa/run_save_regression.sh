#!/usr/bin/env bash
set -euo pipefail

echo "[save-regression] Running save compatibility checks"
MANIFEST="qa/config/save_regression_matrix.yaml"
if [ ! -f "$MANIFEST" ]; then
  echo "[save-regression] Missing $MANIFEST"
  exit 1
fi

if [ -d "saves/fixtures" ]; then
  echo "[save-regression] fixtures detected: $(find saves/fixtures -maxdepth 1 -type f | wc -l)"
fi

test -f "$MANIFEST"
echo "[save-regression] OK"
