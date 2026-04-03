# Adoption Playbook

This page explains how to roll out shared repository standards into real repositories without creating a large, risky migration.

## Why standards rollouts usually fail

Many standards projects fail for one of these reasons:

- they try to replace too many files at once
- they assume all target repositories are greenfield
- they hide the real diff behind generators
- they require teams to trust a tool before they can review the change

Those problems get worse in AI-assisted repositories, where multiple tools, prompts, and local conventions evolve quickly.

## The design goal

`project-standards` is intentionally shaped around a small, reviewable adoption path:

- preview the exact diff first
- keep writes explicit
- avoid clobbering repository-specific files
- separate shared config from in-repo templates
- make future upgrades possible without forcing full replacement

## The rollout strategy

### 1. Start with `diff`

The first step for an existing repository should always be a read-only preview:

```sh
node packages/cli/dist/index.js diff ../target-repository
```

This keeps the review conversation grounded in the actual change instead of an abstract promise.

### 2. Prefer `--dry-run` before real writes

If the diff looks reasonable, the next step is still a non-destructive dry run:

```sh
node packages/cli/dist/index.js apply ../target-repository --include quality --dry-run
```

That extra step matters when the target repository is active and has local conventions that the base preset should not silently overwrite.

### 3. Use file strategies that respect reality

The current MVP intentionally keeps the strategy surface small:

- `create_if_missing`
- `replace_if_managed`

This avoids pretending that partial ownership is easy. A repository either opts into a managed file or keeps its local version.

### 4. Keep shared config and templates separate

Two kinds of standards should not be treated the same:

- shared config packages are better referenced than copied
- repository-local files still need templates and explicit ownership rules

That separation makes it easier to update behavior later without hiding the source of truth.

## Why this works well for AI-assisted repositories

AI-assisted development increases the number of generated docs, prompts, rules, and local workflow files. That makes accidental drift more likely.

A useful standards tool in that environment should:

- show the diff before writing
- keep managed boundaries obvious
- avoid destructive upgrades by default
- make quality-related adoption small enough for normal review

`project-standards` is designed around those constraints instead of treating them as edge cases.

## A practical rollout order

For an existing repository, a safe sequence usually looks like this:

1. inspect the current repository and decide what should remain local
2. run `diff`
3. apply only the quality-related subset with `--dry-run`
4. review the result with the team
5. run the real apply once the managed boundaries are accepted
6. leave stack-specific follow-ups for separate PRs

## What this page should signal

This repository is not just a config dump. It is an attempt to make repository standards adoptable in the messy conditions where teams actually work:

- existing repositories
- multiple tools
- AI-assisted workflows
- partial ownership
- review-first engineering culture
