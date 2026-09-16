#!/usr/bin/env bash
# Shared library, sourced by verify-src.sh (Stop) and guard-commit.sh (PreToolUse).
#
# Both hooks need the same answer to "have these exact pending changes already been
# checked and found clean?" — so they compute the same hash over the same paths and
# read/write the same cache file, keyed per session. Whichever hook runs `npm run
# typecheck && npm run lint` and passes writes the cache; the other one can then skip
# re-running for the identical state. This is purely a fast-path: neither hook trusts
# the cache blindly — each still computes a fresh hash to compare against it every time.
#
# Not directly executable — `source` this file.

# Paths whose content can change a typecheck/lint result. Broader than just `src/` on
# purpose: an eslint.config.mjs or tsconfig.json edit can flip the result of every file,
# so the cache has to invalidate on those too, even though each hook's own decision to
# bother calling into this library at all is still scoped independently (verify-src.sh
# only fires on src/ changes; guard-commit.sh fires on src/ or these config files).
CHECK_CACHE_GATED_PATHS=(src eslint.config.mjs tsconfig.json package.json)

# Hash of every pending change (staged, unstaged, and untracked) under the gated paths,
# relative to HEAD. Deliberately not staged-only: typecheck/lint read the working tree,
# not the index, so what's staged is irrelevant to what the commands will actually see.
#
# Reads each changed path's *current working-tree content* uniformly via `cat`, rather
# than including `git diff`'s own diff-formatted output. Diff format embeds the file's
# staged-vs-unstaged status in its own bytes (headers, +/- markers), so the same content
# would hash differently depending on staging state alone — which would silently defeat
# the cache the moment a file's staged status changes between two otherwise-identical
# checks (e.g. a passing check while staged, then the same content re-checked unstaged).
check_cache_hash() {
  {
    git diff HEAD --name-only -- "${CHECK_CACHE_GATED_PATHS[@]}" 2>/dev/null
    git ls-files --others --exclude-standard -- "${CHECK_CACHE_GATED_PATHS[@]}" 2>/dev/null
  } | sort -u | while IFS= read -r f; do
    printf '%s\n' "$f"
    if [ -f "$f" ]; then
      cat "$f" 2>/dev/null
    else
      printf '<deleted>\n'
    fi
  done | shasum -a 256 | awk '{print $1}'
}

# $1 = scratchpad_dir from the hook's stdin JSON (may be empty), $2 = session_id
check_cache_file() {
  local state_dir="$1" session_id="$2"
  if [ -z "$state_dir" ] || [ ! -d "$state_dir" ]; then
    state_dir="${TMPDIR:-/tmp}"
  fi
  printf '%s/check-cache-%s' "${state_dir%/}" "${session_id:-unknown}"
}

check_cache_read() {
  local file="$1"
  [ -f "$file" ] && cat "$file" 2>/dev/null
}

check_cache_write() {
  local file="$1" hash="$2"
  printf '%s' "$hash" > "$file"
}
