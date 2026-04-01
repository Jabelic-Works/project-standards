# CLI

## コマンド

公開している利用フローでは、次の 3 つのコマンドを中心に使います。

- `init`
- `apply`
- `diff`

## 各コマンドの役割

- `init`: baseline preset から新しいリポジトリディレクトリを作る
- `diff`: preset を適用したときの差分を既存リポジトリに対して確認する
- `apply`: レビュー済みの変更を対象リポジトリへ書き込む

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
