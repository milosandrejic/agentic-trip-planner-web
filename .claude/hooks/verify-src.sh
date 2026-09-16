#!/usr/bin/env bash
# Stop hook.
#
# Keeps Claude from ending a turn while uncommitted src/ changes fail typecheck or lint,
# without ever letting it grind on a failure out of the user's sight.
#
#   no uncommitted src/ changes -> exit 0 at once, so ordinary conversation stays fast
#   checks pass                 -> exit 0
#   attempt 1-2 of this turn    -> block: fix the errors, and tell the user what broke
#   attempt 3                   -> block once more: stop fixing, report to the user, ask
#   attempt 4+                  -> allow the stop, with a visible warning
#
# The count resets on the first stop of every turn (stop_hook_active is false there), so
# after an escalation the user decides what happens next.

set -uo pipefail

MAX_FIX_ATTEMPTS=2
OUTPUT_LINES=120

input=$(cat)
project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$project_dir" || exit 0

if [ -z "$(git status --porcelain -- src/ 2>/dev/null)" ]; then
  exit 0
fi

read_field() {
  HOOK_INPUT="$input" node -e '
    try {
      const value = JSON.parse(process.env.HOOK_INPUT)[process.argv[1]];
      process.stdout.write(value === undefined || value === null ? "" : String(value));
    } catch {}
  ' "$1"
}

session_id=$(read_field session_id)
stop_hook_active=$(read_field stop_hook_active)
state_dir=$(read_field scratchpad_dir)
if [ -z "$state_dir" ] || [ ! -d "$state_dir" ]; then
  state_dir="${TMPDIR:-/tmp}"
fi
counter_file="${state_dir%/}/verify-src-attempts-${session_id:-unknown}"

previous=0
if [ "$stop_hook_active" = "true" ] && [ -f "$counter_file" ]; then
  previous=$(cat "$counter_file" 2>/dev/null)
  case "$previous" in
    '' | *[!0-9]*) previous=0 ;;
  esac
fi
attempt=$((previous + 1))

typecheck_output=$(npm run --silent typecheck 2>&1)
typecheck_status=$?
lint_output=$(npm run --silent lint 2>&1)
lint_status=$?

if [ "$typecheck_status" -eq 0 ] && [ "$lint_status" -eq 0 ]; then
  rm -f "$counter_file"
  exit 0
fi

echo "$attempt" > "$counter_file"

failures=""
if [ "$typecheck_status" -ne 0 ]; then
  failures="${failures}--- npm run typecheck ---
$(printf '%s\n' "$typecheck_output" | tail -n "$OUTPUT_LINES")

"
fi
if [ "$lint_status" -ne 0 ]; then
  failures="${failures}--- npm run lint ---
$(printf '%s\n' "$lint_output" | tail -n "$OUTPUT_LINES")
"
fi

if [ "$attempt" -le "$MAX_FIX_ATTEMPTS" ]; then
  {
    echo "Uncommitted src/ changes fail the checks (fix attempt $attempt of $MAX_FIX_ATTEMPTS)."
    echo "Fix the errors below. When you report back, tell the user what broke and what you"
    echo "changed to fix it. Do not fix silently."
    echo
    printf '%s\n' "$failures"
  } >&2
  exit 2
fi

if [ "$attempt" -eq $((MAX_FIX_ATTEMPTS + 1)) ]; then
  {
    echo "The checks still fail after $MAX_FIX_ATTEMPTS fix attempts. Stop trying to fix them."
    echo "Tell the user exactly what is failing and what you already tried, then ask how they"
    echo "want to proceed. Do not change any more code in this turn."
    echo
    printf '%s\n' "$failures"
  } >&2
  exit 2
fi

node -e '
  process.stdout.write(JSON.stringify({
    systemMessage:
      "typecheck/lint still fail on uncommitted src/ changes. Claude was asked to stop " +
      "and check with you before continuing.",
  }));
'
exit 0
