#!/usr/bin/env bash
# PreToolUse hook on Bash.
#
#   no `git commit` or `git push` anywhere in the command -> allow immediately, no git
#                                                             or npm calls at all (this
#                                                             fires on every Bash call,
#                                                             so the common case must be
#                                                             fast)
#   `git push` in any form (incl. global options before the
#     subcommand, e.g. `git -c foo=bar push`, `git --no-pager push`) -> deny (second layer
#                                                             behind the settings.json deny rule)
#   `git commit` present, message contains a trailer      -> deny, ask Claude to drop it.
#     Checked both in the command string itself (covers -m, and a heredoc body passed to
#     -F-/--file=-, since that text is part of the command) and, when -F <file> or
#     --file=<file> names a real file, in that file's own content.
#   `git commit` present, gated paths have pending changes
#     (staged, unstaged, or untracked — a PreToolUse hook runs *before* the command, so
#     `git add . && git commit` and `git commit -a` have nothing staged yet at this point)
#     -> always run `npm run typecheck && npm run lint`; deny with the last ~120 lines on
#        failure. No cache — a cached pass can go stale the moment HEAD moves (e.g. a
#        rebase or a fresh pull) without the pending diff itself changing, which would
#        let a real failure through.
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

# Paths whose content can change a typecheck/lint result. Broader than just `src/` on
# purpose: an eslint.config.mjs or tsconfig.json edit can flip the result of every file.
GATED_PATHS=(src eslint.config.mjs tsconfig.json package.json)

OUTPUT_LINES=120

input=$(cat)

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

# Global git options come before the subcommand and most take a value, either attached
# (`--git-dir=<path>`) or as a following token (`-c foo=bar`, `-C <path>`). Match zero or
# more of either shape between `git` and the subcommand.
GIT_GLOBAL_OPTS='([[:space:]]+-[A-Za-z]([[:space:]]+[^[:space:]]+)?|[[:space:]]+--[A-Za-z][A-Za-z0-9-]*(=[^[:space:]]+)?)*'

has_git_commit=0
echo "$command_str" | grep -qE "(^|[;&|]|&&)[[:space:]]*git${GIT_GLOBAL_OPTS}[[:space:]]+commit\\b" \
  && has_git_commit=1

has_git_push=0
echo "$command_str" | grep -qE "(^|[;&|]|&&)[[:space:]]*git${GIT_GLOBAL_OPTS}[[:space:]]+push\\b" \
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
TRAILER_PATTERN='co-authored-by|claude-session|generated with claude code'

if echo "$command_str" | grep -qiE "$TRAILER_PATTERN"; then
  deny "Drop the attribution trailer (Co-Authored-By / Claude-Session / \"Generated with Claude Code\") and retry — this repo never adds one."
fi

# `-F <file>` / `--file=<file>` / `--file <file>` point the message at a file whose content
# never appears in the command string, so the check above can't see it — read it directly.
message_file=$(COMMAND_STR="$command_str" node -e '
  const m = process.env.COMMAND_STR.match(/(?:^|\s)(?:-F\s*|--file(?:=|\s+))(\S+)/);
  process.stdout.write(m ? m[1] : "");
')

if [ -n "$message_file" ] && [ -f "$message_file" ] \
  && grep -qiE "$TRAILER_PATTERN" "$message_file"; then
  deny "Drop the attribution trailer (Co-Authored-By / Claude-Session / \"Generated with Claude Code\") from $message_file and retry — this repo never adds one."
fi

pending=$(git status --porcelain -- "${GATED_PATHS[@]}" 2>/dev/null)
if [ -z "$pending" ]; then
  exit 0
fi

typecheck_output=$(npm run --silent typecheck 2>&1)
typecheck_status=$?
lint_output=$(npm run --silent lint 2>&1)
lint_status=$?

if [ "$typecheck_status" -eq 0 ] && [ "$lint_status" -eq 0 ]; then
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
