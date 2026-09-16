---
name: open-pr
description: Push the current branch and open a PR against a given base — checks pass first, nothing happens silently.
disable-model-invocation: true
argument-hint: "<target-branch>"
allowed-tools: Bash, Read
---

Push the current branch and open a PR against **$ARGUMENTS**. Never guess the target — if
`$ARGUMENTS` is empty, ask which branch this merges into and stop.

## 1. Refuse the unsafe cases

- Current branch is `main` — stop. Never push or PR from `main`.
- Current branch equals `$ARGUMENTS` — stop, nothing to merge.
- `git status --porcelain` is not empty — stop and say what's uncommitted. This pushes
  committed work only.

## 2. Verify

Run `npm run typecheck && npm run lint`. If either fails, stop and show the output. Do not
push code that doesn't pass.

## 3. Show what's about to go out

`git log $ARGUMENTS..HEAD --oneline` — print it. This is the actual diff of commits the PR
will contain; look at it before anything touches the network.

## 4. Push and open the PR

```
git push -u origin <current-branch>
gh pr create --base $ARGUMENTS --head <current-branch> --title "<title>" --body "<body>"
```

- **Title:** the branch's own theme in a sentence, not a copy of one commit subject.
- **Body:** the commit list from step 3, one line each. Nothing else — no pasted file
  contents, command output, or environment values. **No `Co-Authored-By` or "Generated
  with" trailer of any kind** — same rule as commits.

Both the push and `gh pr create` are configured to prompt for your approval individually —
this skill does not bypass that.

## 5. Report

The PR URL. If this was a phase branch closing into a sprint branch, name what's left in the
sprint. If this was a sprint branch closing into `main`, remind the user that archiving the
sprint's `PLAN.md` into `docs/plans/` and opening the next sprint's `PLAN.md` happens as part
of reviewing that PR, not automatically here.
