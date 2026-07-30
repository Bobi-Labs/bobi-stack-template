#!/usr/bin/env bash
# secret-scan.sh — scan a repo for leaked secrets with gitleaks.
# Built by the tools box (2026-07-30) as the free private-repo counterpart to
# GitHub secret scanning, which is paid for private repos (verified: API 422).
#
# Usage:
#   scripts/secret-scan.sh [repo-path]        # full git history scan (default: cwd)
#   scripts/secret-scan.sh --dir [path]       # working-tree files only, no history
#
# Exit codes: 0 = clean, 1 = leaks found, 2 = scan failed, 127 = gitleaks missing.
#
# VERIFIED 2026-07-30 on gitleaks 8.30.1 / Windows Git Bash: the process EXIT CODE
# does not signal leaks in this version (leaks exit 0, with or without --exit-code;
# NUL and /dev/null are unwritable as report paths and turn every run into an error).
# So this wrapper judges from the JSON report instead: a clean scan writes literally
# "[]". The report lands in a temp file and is deleted immediately — findings echo to
# the terminal only.

set -u

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "gitleaks is not installed. Operator installs it with:" >&2
  echo "  winget install Gitleaks.Gitleaks" >&2
  echo "(new shells only see it after the installing app/terminal restarts)" >&2
  exit 127
fi

MODE="git"
if [ "${1:-}" = "--dir" ]; then
  MODE="dir"
  shift
fi
TARGET="${1:-.}"

REPORT="$(mktemp "${TMPDIR:-/tmp}/secretscan.XXXXXX.json")"
trap 'rm -f "$REPORT"' EXIT

if [ "$MODE" = "dir" ]; then
  gitleaks dir "$TARGET" --no-banner --report-path "$REPORT"
else
  # Full history: a secret removed at HEAD but present in an old commit still counts
  # (redaction at HEAD is cosmetic; rotation is the remedy — umbrella lesson 2026-07-29).
  gitleaks git "$TARGET" --no-banner --report-path "$REPORT"
fi

if [ ! -s "$REPORT" ]; then
  echo "secret-scan: scan failed (no report produced)" >&2
  exit 2
fi

if [ "$(tr -d '[:space:]' < "$REPORT")" = "[]" ]; then
  exit 0
fi
exit 1
