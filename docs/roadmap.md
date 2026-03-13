# Roadmap

## Implemented now

- pnpm workspace and TypeScript project references
- base preset manifest and template files
- diffable plan and apply engine
- minimal shared config packages
- safe CLI for `init`, `apply`, and `diff`

## Deferred for follow-up work

- stack composition beyond the base preset
- package manager and dependency mutation inside target repositories
- richer merge strategies for partially managed files
- `doctor` checks for stack-specific quality tools
- `upgrade` flows for refreshing managed files and preset versions

## Likely extensions

- additional presets such as `react`, `vue`, or `library`
- doctor integrations for `react-doctor`, `vue-doctor`, `knip`, `secretlint`, `markdownlint`, `publint`, and `tsc --noEmit`
- more shared config packages and stack plugins
- generated PR-friendly change plans per repository
