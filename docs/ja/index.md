# Project Standards

`project-standards` は、リポジトリ標準を 1 か所で管理するための pnpm モノレポです。

実際の設定ソースと、それを適用する CLI を同じ場所に置くことで、新規リポジトリにも既存リポジトリにも、小さくレビューしやすい差分で同じベースラインを導入できるようにします。

## このリポジトリが担うこと

このリポジトリは、次の 3 つの責務をまとめています。

- 各リポジトリに設定をコピーしすぎずに使える shared config package
- 対象リポジトリ内に実在すべきファイルを配る template
- それらの差分を plan / diff / apply できる Node.js CLI

現在の MVP は、小さな `base` preset を中心にしています。

- Renovate のベース設定
- Stylistic ルールを含む shared ESLint flat config
- Oxlint / Oxfmt のスターター設定
- `AGENTS.md`、`CLAUDE.md`、Cursor rule、Cursor command

## 次に読む

- [基本概念](./concepts.md)
- [CLI](./cli.md)
- [Base Template](./templates/base.md)
- [ロードマップ](./roadmap.md)

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
