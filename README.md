# Project Standards

`project-standards` is a pnpm monorepo for rolling out shared repository standards with a small, reviewable diff.

It combines shared config packages, repository templates, and a CLI so teams can adopt a common baseline without copying large configuration blocks into every repository.

## Documentation

Product documentation lives in `docs/` and is published as a VitePress site in English and Japanese.

- overview: `docs/index.md`
- concepts and safety model: `docs/concepts.md`
- CLI usage: `docs/cli.md`
- base preset details: `docs/templates/base.md`
- Japanese pages: `docs/ja/`

To run the docs locally:

```sh
pnpm docs:dev
```

## What This Repository Does

This repository combines three responsibilities:

- shared configuration packages for tools that should be referenced instead of copied
- repository templates for files that must exist inside each target repository
- a Node.js CLI that can `init`, `diff`, and `apply` those files safely

## Current Base Preset

The first `base` preset includes:

- Renovate baseline config
- shared ESLint flat config with Stylistic rules
- Oxlint and Oxfmt starter files
- `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Cursor commands

## Typical Workflow

For an existing repository:

1. Run `diff` to preview the proposed changes.
2. Review the plan and the generated diff.
3. Run `apply --dry-run` if you want an extra safety check.
4. Run `apply` once the diff looks correct.

For a new repository:

1. Run `init` against an empty or intentionally prepared directory.
2. Review the created baseline files.
3. Add repository-specific setup on top of the generated scaffold.

## Workspace Layout

```text
.
├── docs
├── packages
│   ├── cli
│   ├── core
│   ├── eslint-config
│   └── renovate-config
├── templates
│   └── base
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── tsconfig.json
```
