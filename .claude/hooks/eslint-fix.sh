#!/usr/bin/env bash
# PostToolUse hook for Edit|Write.
#
# Runs `eslint --fix` on the edited file when it is TypeScript under src/, then reports
# anything ESLint could not fix back to Claude as additionalContext. A PostToolUse hook
# cannot block — the edit has already happened — so this always exits 0.

set -uo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"

file_path=$(node -e '
  try {
    const input = JSON.parse(require("fs").readFileSync(0, "utf8"));
    process.stdout.write(input.tool_input?.file_path ?? "");
  } catch {}
')

case "$file_path" in
  "$project_dir"/src/*.ts | "$project_dir"/src/*.tsx) relative_path="${file_path#"$project_dir"/}" ;;
  src/*.ts | src/*.tsx) relative_path="$file_path" ;;
  *) exit 0 ;;
esac

cd "$project_dir" || exit 0
[ -f "$relative_path" ] || exit 0

if lint_output=$(npx eslint --fix --max-warnings=0 "$relative_path" 2>&1); then
  exit 0
fi

LINT_OUTPUT="$lint_output" node -e '
  const file = process.argv[1];
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext:
        `ESLint auto-fixed what it could in ${file}, but these problems remain. ` +
        `Fix them before moving on:\n\n${process.env.LINT_OUTPUT}`,
    },
  }));
' "$relative_path"

exit 0
