# Concepts

## Mental model

`project-standards` manages repository standards as named presets.

A preset points to template files and the rules that decide how those files may be applied.

## Presets

The repository currently provides a `base` preset defined by `templates/base/preset.json`.

Each entry in the preset maps:

- a source file inside `templates/<preset>/files/`
- a target file path in the repository being updated
- a file strategy that decides whether the change is safe to apply
- optional tags used for partial rollout such as `quality` or `ai`

## Safety model

The current preset uses two file strategies:

- `create_if_missing`: create a file only when it does not already exist
- `replace_if_managed`: replace a file only when it contains the managed marker

These strategies keep the default flow reviewable for both new and existing repositories.

## Managed marker

Managed files use the marker `managed-by: @jabelic/standards`.

When the marker is present, future runs can safely replace the file.
When the marker is absent, the file is treated as repository-owned and skipped unless forced.

## Shared config packages

Some generated files are thin entrypoints that reference shared packages from this monorepo instead of copying large config blocks into each target repository.

This keeps standards centralized and makes package updates easier to review, but target repositories still need the referenced dependencies installed.
