# CLI

## コマンド

初期の CLI entrypoint では、次のコマンドを提供しています。

- `init`
- `apply`
- `diff`
- stub の `doctor`
- stub の `upgrade`

## 基本的な使い方

既存リポジトリに対しては、次の流れを想定しています。

1. まず `diff` を実行して、提案される差分を確認する
2. その preset を対象リポジトリへ適用してよい状態かをレビューする
3. 必要なら `--dry-run` 付きの `apply` でさらに安全確認する
4. 差分に問題がなければ実際の `apply` を行う

新規リポジトリに対しては、次の流れを想定しています。

1. 空ディレクトリ、または意図的に準備したディレクトリに対して `init` を実行する
2. 生成された baseline file を確認する
3. その上に repository-specific な設定を積み増す

## 使用例

依存を入れて workspace を build する:

```sh
pnpm install
pnpm build
```

ヘルプを表示する:

```sh
node packages/cli/dist/index.js --help
```

対象リポジトリへの diff を確認する:

```sh
node packages/cli/dist/index.js diff ../target-repository
```

`quality` tag の file だけを dry-run で適用する:

```sh
node packages/cli/dist/index.js apply ../target-repository --include quality --dry-run
```

新しいリポジトリディレクトリを初期化する:

```sh
node packages/cli/dist/index.js init ../new-repository --yes
```

## 現時点の制約

- stack composition は将来の preset composition 用に予約されている
- target repository 側の dependency installation はまだ自動化していない
- partially managed file に対する richer merge behavior は後続対応
