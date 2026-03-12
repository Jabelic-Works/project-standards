# Base Template

## Purpose

`templates/base` is the first preset manifest plus the concrete files applied into target repositories.

Its job is to establish a minimal shared baseline for repository quality tooling and AI-facing guidance.

## Managed targets

The current preset includes:

- `renovate.json`
- `eslint.config.mjs`
- `.oxlintrc.json`
- `.oxfmtrc.json`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/repository-standards.mdc`
- `.cursor/commands/quality-check.md`

## Important MVP notes

- `eslint.config.mjs` assumes the target repository also installs `@jabelic/eslint-config`
- `AGENTS.md` and `CLAUDE.md` are managed base stubs; stack-specific composition is reserved for later
- some files are create-only scaffolding and are not yet upgraded automatically once a repository diverges

## Why the preset is conservative

The preset is intentionally cautious because it is designed to work for both new and existing repositories.

That is why the planner prefers:

- create-only behavior for files that are risky to overwrite blindly
- replacement only when a managed marker proves that the tool owns the file

This conservative behavior keeps the initial rollout reviewable while leaving room for richer merge strategies later.
