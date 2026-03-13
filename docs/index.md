# Project Standards

`project-standards` is a pnpm monorepo for managing repository standards in one place.

It keeps the real configuration sources and the applying CLI together so that new and existing repositories can adopt the same baseline with a small, reviewable diff.

## What this repository does

This repository combines three responsibilities:

- shared configuration packages for tools that should be referenced instead of copied
- repository templates for files that must exist inside each target repository
- a Node.js CLI that can plan, diff, and apply those files safely

The current MVP focuses on a small base preset with:

- Renovate baseline config
- shared ESLint flat config with Stylistic rules
- Oxlint and Oxfmt starter files
- `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Cursor commands

## Read next

- [Concepts](./concepts.md)
- [CLI](./cli.md)
- [Base Template](./templates/base.md)
- [Roadmap](./roadmap.md)

## Workspace layout

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
