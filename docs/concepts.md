# Concepts

## Design goals

- support both new repositories and existing repositories
- stay idempotent wherever possible
- make `diff` and `--dry-run` the default review path
- avoid clobbering repository-specific files by default
- keep preset and template expansion easy for future stacks

## Presets

A preset is a named bundle of template files plus metadata.

Today the repository ships a single preset, `base`, defined by `templates/base/preset.json`.

Each entry in the preset maps:

- a source file inside `templates/<preset>/files/`
- a target file path in the repository being updated
- a file strategy that decides whether the change is safe to apply
- optional tags used for partial rollout such as `quality` or `ai`

## File strategies

The current MVP uses two strategies:

- `create_if_missing`: create a file only when it does not already exist
- `replace_if_managed`: replace a file only when it contains the managed marker

This keeps existing repositories safe while still allowing standards-managed files to be upgraded later.

## Managed marker

Managed files use the marker `managed-by: @jabelic/standards`.

When a file is marked as managed, the planner can replace it on future runs.
When the marker is absent, the planner treats the file as repository-owned and skips replacement unless forced.

## Shared config packages

Some generated files are thin entrypoints that reference shared packages from this monorepo instead of copying large config blocks into each target repository.

That keeps standards centralized, but it also means some templates currently assume target-repository dependency installation that is still deferred in the MVP.
