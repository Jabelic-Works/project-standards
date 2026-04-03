# Project Standards

`project-standards` is a pnpm monorepo that helps teams roll out repository standards with a small, reviewable diff.

It combines shared config packages, repository templates, and a CLI so teams can adopt a common baseline without copying large configuration blocks into every repository.

## What teams get

- a `base` preset for repository quality and AI-facing guidance
- a safe `diff` / `apply` workflow for existing repositories
- an `init` flow for new repositories
- shared config packages that keep standards centralized

## Included in the base preset

- Renovate baseline config
- shared ESLint flat config with Stylistic rules
- Oxlint and Oxfmt starter files
- `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Cursor commands

## Read next

- [Concepts](./concepts.md)
- [Adoption Playbook](./adoption-playbook.md)
- [CLI](./cli.md)
- [Base Template](./templates/base.md)

## Typical adoption flow

1. Preview a repository with `diff`.
2. Review the proposed changes.
3. Apply the preset once the diff looks right.

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
