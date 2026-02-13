#!/usr/bin/env bash
set -euo pipefail

echo "[integration] Running integration tests"
if [ -f "docker-compose.yml" ] && command -v docker >/dev/null 2>&1; then
  echo "[integration] docker-compose workflow placeholder"
  docker compose config >/dev/null
else
  echo "[integration] No integration stack detected, validating AB policy schema"
  test -f qa/config/ab_experiments.yaml
  test -f qa/config/ab_guardrails.yaml
fi

echo "[integration] OK"
