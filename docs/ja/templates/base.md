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

## target repository 側で把握しておくこと

- `eslint.config.mjs` は、target repository 側でも `@jabelic/eslint-config` を install している前提
- `AGENTS.md` と `CLAUDE.md` は AI tooling 向けの managed starter document
- 一部の file は不足時のみ作成され、managed file は後続実行で更新される

## どう安全性を保つか

この preset は、新規リポジトリと既存リポジトリの両方に安全に適用することを優先しているため、意図的に保守的です。

そのため planner は次を優先します。

- むやみに上書きすると危険な file では create-only に寄せる
- managed marker でツール所有と判定できる file だけを置き換える

この挙動によって、初期導入をレビューしやすく予測可能に保てます。
