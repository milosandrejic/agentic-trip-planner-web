#!/usr/bin/env bash
# PreToolUse hook on Bash.
#
#   no `git commit` or `git push` anywhere in the command -> allow immediately, no git
#                                                             or npm calls at all (this
#                                                             fires on every Bash call,
#                                                             so the common case must be
#                                                             fast)
#   `git push` in any form (incl. `git -C <path> push`)   -> deny (second layer behind
#                                                             the settings.json deny rule)
#   `git commit` present, message contains a trailer      -> deny, ask Claude to drop it
#   `git commit` present, gated paths have pending changes
#     (staged, unstaged, or untracked — a PreToolUse hook runs *before* the command, so
#     `git add . && git commit` and `git commit -a` have nothing staged yet at this point)
#     -> reuse the Stop hook's pass cache if the hash is unchanged, else run
#        `npm run typecheck && npm run lint`; deny with the last ~120 lines on failure
#   `git commit` present, only non-gated paths pending     -> allow (docs-only commits
#                                                              skip the checks)
#
# Detection is regex-based, not a real shell parser — mirrors Claude Code's own
# documented Bash-rule matching (splitting on &&, ||, ;, |, |&, &, newlines) closely
# enough for this repo's normal commands, at the same "best effort, not bulletproof"
# level as those built-in rules. It is a second layer, not the only one: CLAUDE.md
# already tells Claude to run these checks itself before committing.

set -uo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$project_dir" || exit 0

# shellcheck source=lib/check-cache.sh
source "$project_dir/.claude/hooks/lib/check-cache.sh"

OUTPUT_LINES=120

input=$(cat)

read_field() {
  HOOK_INPUT="$input" node -e '
    try {
      const value = JSON.parse(process.env.HOOK_INPUT)[process.argv[1]];
      process.stdout.write(value === undefined || value === null ? "" : String(value));
    } catch {}
  ' "$1"
}

# tool_input.command is nested; read_field only handles top-level keys.
command_str=$(HOOK_INPUT="$input" node -e '
  try {
    const input = JSON.parse(process.env.HOOK_INPUT);
    process.stdout.write(input.tool_input?.command ?? "");
  } catch {}
')

[ -z "$command_str" ] && exit 0

deny() {
  REASON="$1" node -e '
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: process.env.REASON,
      },
    }));
  '
  exit 0
}

has_git_commit=0
echo "$command_str" | grep -qE '(^|[;&|]|&&)[[:space:]]*git([[:space:]]+-C[[:space:]]+[^ ]+)?[[:space:]]+commit\b' \
  && has_git_commit=1

has_git_push=0
echo "$command_str" | grep -qE '(^|[;&|]|&&)[[:space:]]*git([[:space:]]+-C[[:space:]]+[^ ]+)?[[:space:]]+push\b' \
  && has_git_push=1

if [ "$has_git_push" -eq 1 ]; then
  deny "git push is denied for Claude — pushing is always manual, done by the user."
fi

if [ "$has_git_commit" -eq 0 ]; then
  exit 0
fi

# Trailer check — gated strictly on a real `git commit` being present, so an unrelated
# command that merely mentions one of these strings (e.g. `git log --grep Co-Authored-By`)
# is never touched.
if echo "$command_str" | grep -qiE 'co-authored-by|claude-session|generated with claude code'; then
  deny "Drop the attribution trailer (Co-Authored-By / Claude-Session / \"Generated with Claude Code\") and retry — this repo never adds one."
fi

pending=$(git status --porcelain -- "${CHECK_CACHE_GATED_PATHS[@]}" 2>/dev/null)
if [ -z "$pending" ]; then
  exit 0
fi

session_id=$(read_field session_id)
scratchpad_dir=$(read_field scratchpad_dir)
cache_file=$(check_cache_file "$scratchpad_dir" "$session_id")
current_hash=$(check_cache_hash)
cached_hash=$(check_cache_read "$cache_file")

if [ -n "$cached_hash" ] && [ "$current_hash" = "$cached_hash" ]; then
  exit 0
fi

typecheck_output=$(npm run --silent typecheck 2>&1)
typecheck_status=$?
lint_output=$(npm run --silent lint 2>&1)
lint_status=$?

if [ "$typecheck_status" -eq 0 ] && [ "$lint_status" -eq 0 ]; then
  check_cache_write "$cache_file" "$current_hash"
  exit 0
fi

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

deny "typecheck/lint fail on the changes this commit would include. Fix them first:

$failures"
