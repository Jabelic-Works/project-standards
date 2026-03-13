# Base Template

## 目的

`templates/base` は、最初の preset manifest と、target repository に実際に適用される concrete file をまとめたものです。

役割は、repository quality tool と AI 向けガイダンスのための最小共有 baseline を用意することです。

## 管理対象

現在の preset には次の file が含まれます。

- `renovate.json`
- `eslint.config.mjs`
- `.oxlintrc.json`
- `.oxfmtrc.json`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/repository-standards.mdc`
- `.cursor/commands/quality-check.md`

## MVP 時点で重要な前提

- `eslint.config.mjs` は、target repository 側でも `@jabelic/eslint-config` を install している前提
- `AGENTS.md` と `CLAUDE.md` は managed な base stub であり、stack ごとの composition は後続対応
- 一部の file は create-only な scaffold であり、repository が分岐した後に自動更新される設計にはまだなっていない

## なぜ保守的なのか

この preset は、新規リポジトリと既存リポジトリの両方に安全に適用することを優先しているため、意図的に保守的です。

そのため planner は次を優先します。

- むやみに上書きすると危険な file では create-only に寄せる
- managed marker でツール所有と判定できる file だけを置き換える

この保守的な挙動によって、初期導入をレビューしやすくしつつ、将来 richer merge strategy へ拡張する余地を残しています。
