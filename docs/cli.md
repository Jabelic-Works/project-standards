# CLI

## Commands

The initial CLI entrypoint supports:

- `init`
- `apply`
- `diff`
- `doctor` as a stub
- `upgrade` as a stub

## Typical workflow

For an existing repository:

1. Run `diff` first to preview the proposed changes.
2. Review the plan and decide whether the target repository is ready for the preset.
3. Run `apply` with `--dry-run` if you want an extra safety check.
4. Run `apply` for the real write once the diff looks correct.

For a new repository:

1. Run `init` against an empty or intentionally prepared directory.
2. Review the created baseline files.
3. Add repository-specific setup on top of the generated scaffold.

## Example usage

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

## Current limitations

- stack composition is reserved for future preset composition
- dependency installation in target repositories is not yet automated
- richer merge behavior for partially managed files is deferred
