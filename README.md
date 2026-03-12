# Project Standards

`project-standards` is a pnpm monorepo for managing repository standards in one place.

It keeps the real configuration sources and the applying CLI together so that new and existing repositories can adopt the same baseline with a small, reviewable diff.

## Documentation

Structured docs live in `docs/` and are intended to make reviews and spec discussions easier.

The VitePress docs support both English and Japanese.

- overview: `docs/index.md`
- concepts and file strategies: `docs/concepts.md`
- CLI behavior: `docs/cli.md`
- base preset details: `docs/templates/base.md`
- roadmap and deferred work: `docs/roadmap.md`
- Japanese pages: `docs/ja/`

To run the docs locally:

```sh
pnpm docs:dev
```

## What This Repository Does

This repository is designed around three responsibilities:

- shared configuration packages for tools that should be referenced instead of copied
- repository templates for files that must exist inside each target repository
- a Node.js CLI that can plan, diff, and apply those files safely

The current MVP focuses on a small base preset with:

- Renovate baseline config
- shared ESLint flat config with Stylistic rules
- Oxlint and Oxfmt starter files
- `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Cursor commands

## Design Goals

- support both new repositories and existing repositories
- stay idempotent wherever possible
- make `diff` and `--dry-run` the default review path
- avoid clobbering repository-specific files by default
- keep preset and template expansion easy for future stacks

## MVP Strategy

The initial implementation uses two file strategies:

- `create_if_missing`: create a file only when it does not already exist
- `replace_if_managed`: replace a file only when it contains the managed marker

This keeps existing repositories safe while still allowing standards-managed files to be upgraded later.

## Workspace Layout

```text
.
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

## Packages

### `packages/core`

Shared planner primitives:

- preset manifest loading
- file strategy evaluation
- diff rendering
- dry-run friendly apply flow

### `packages/cli`

The first CLI entrypoint. Current commands:

- `init`
- `apply`
- `diff`
- `doctor` (stub)
- `upgrade` (stub)

### `packages/eslint-config`

Shared ESLint flat config package for repositories that want a common lint baseline.

### `packages/renovate-config`

Shared Renovate config source for the base preset.

## Templates

`templates/base` is the first preset manifest plus concrete files to apply into target repositories.

Current managed targets include:

- `renovate.json`
- `eslint.config.mjs`
- `.oxlintrc.json`
- `.oxfmtrc.json`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/repository-standards.mdc`
- `.cursor/commands/quality-check.md`

Current template notes for the MVP:

- `eslint.config.mjs` assumes the target repository also installs `@jabelic/eslint-config`
- `AGENTS.md` and `CLAUDE.md` are managed base stubs; stack-specific composition is reserved for later

## CLI Usage

Install dependencies and build the workspace:

```sh
pnpm install
pnpm build
```

Show help:

```sh
node packages/cli/dist/index.js --help
```

Preview a repository diff:

```sh
node packages/cli/dist/index.js diff ../target-repository
```

Apply only quality-related files:

```sh
node packages/cli/dist/index.js apply ../target-repository --include quality --dry-run
```

Initialize a new repository directory:

```sh
node packages/cli/dist/index.js init ../new-repository --yes
```

## Current Scope

Implemented now:

- pnpm workspace and TypeScript project references
- base preset manifest and template files
- diffable plan/apply engine
- minimal shared config packages
- safe CLI for `init`, `apply`, and `diff`

Reserved for later:

- stack composition beyond the base preset
- package manager and dependency mutation inside target repositories
- richer merge strategies for partially managed files
- `doctor` checks for stack-specific quality tools
- `upgrade` flows for refreshing managed files and preset versions

## Future Extensions

This monorepo is intentionally shaped so more standards can be added incrementally:

- additional presets such as `react`, `vue`, or `library`
- doctor integrations for `react-doctor`, `vue-doctor`, `knip`, `secretlint`, `markdownlint`, `publint`, and `tsc --noEmit`
- more shared config packages and stack plugins
- generated PR-friendly change plans per repository
