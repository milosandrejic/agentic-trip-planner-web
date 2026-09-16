@AGENTS.md

## Commits

- Conventional commit subject, one short line. That is normally the whole message.
- **Never add a `Co-Authored-By` trailer or any attribution footer.**
- Add a body only when a reviewer genuinely cannot follow the change without it.
  Never paste file contents, command output, environment values, tokens or
  absolute paths into a commit message — it is a permanent, shareable record.
- Never commit before `npm run typecheck && npm run lint` both pass.
