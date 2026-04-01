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

## What target repositories should expect

- `eslint.config.mjs` assumes the target repository also installs `@jabelic/eslint-config`
- `AGENTS.md` and `CLAUDE.md` are managed starter documents for AI tooling
- some files are created only when missing, while managed files can be updated on later runs

## How updates stay safe

The preset is intentionally cautious because it is designed to work for both new and existing repositories.

That is why the planner prefers:

- create-only behavior for files that are risky to overwrite blindly
- replacement only when a managed marker proves that the tool owns the file

This keeps adoption reviewable and predictable.
