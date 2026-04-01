# Project Standards

`project-standards` は、共有リポジトリ標準を小さくレビューしやすい差分で導入するための pnpm モノレポです。

shared config package、repository template、CLI を 1 か所にまとめることで、大きな設定のコピペを避けながら共通 baseline を展開できます。

## このプロダクトでできること

- repository quality と AI 向けガイダンスをまとめた `base` preset
- 既存リポジトリ向けの安全な `diff` / `apply` フロー
- 新規リポジトリ向けの `init` フロー
- 標準設定を中央管理しやすい shared config package

## `base` preset に含まれるもの

- Renovate のベース設定
- Stylistic ルールを含む shared ESLint flat config
- Oxlint / Oxfmt のスターター設定
- `AGENTS.md`、`CLAUDE.md`、Cursor rule、Cursor command

## 次に読む

- [基本概念](./concepts.md)
- [CLI](./cli.md)
- [Base Template](./templates/base.md)

## 基本的な導入フロー

1. `diff` で対象リポジトリに入る差分を確認する
2. 提案された変更内容をレビューする
3. 問題がなければ preset を適用する

## ワークスペース構成

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
