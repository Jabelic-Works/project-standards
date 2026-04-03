# 導入プレイブック

このページでは、共有リポジトリ標準を大きくて危険な migration にせず、既存リポジトリへ小さく導入する考え方を整理します。

## なぜ標準導入は失敗しやすいのか

標準導入がうまくいかない理由は、だいたい次のどれかです。

- 一度に置き換えるファイルが多すぎる
- 対象リポジトリが greenfield だと暗黙に仮定している
- generator の裏に実際の差分が隠れている
- review より先にツールへの信頼を要求してしまう

この問題は、AI 支援開発の repo でさらに大きくなります。prompt、rule、agent guide、local workflow が増えるほど、repo ごとの差異や drift は起きやすくなるからです。

## 設計目標

`project-standards` は、既存 repo にも導入できるよう、次の方針で設計しています。

- まず実差分を `diff` で見る
- write を明示的にする
- repo 固有ファイルをむやみに上書きしない
- shared config と template の責務を分ける
- 将来の upgrade を見据えつつ、最初の導入は小さく保つ

## 導入戦略

### 1. 既存 repo では `diff` から始める

最初の一手は常に read-only preview です。

```sh
node packages/cli/dist/index.js diff ../target-repository
```

まず実差分を見せることで、「何が変わるのか分からないまま apply する」状態を避けます。

### 2. 実 apply の前に `--dry-run` を挟む

差分が妥当でも、次の一手はまだ non-destructive であるべきです。

```sh
node packages/cli/dist/index.js apply ../target-repository --include quality --dry-run
```

対象 repo が既に運用中で、局所的な慣習や管理境界を持っているときほど、この一段が効きます。

### 3. 現実に合わせた file strategy を使う

MVP では strategy をあえて絞っています。

- `create_if_missing`
- `replace_if_managed`

partial ownership を簡単に扱えるふりをせず、「そのファイルを managed として引き受けるか、ローカル管理のままにするか」をはっきりさせるためです。

### 4. shared config と template を分ける

repo 標準には、同じように見えて性質が違うものが混ざります。

- shared config package として参照したいもの
- repo 内に実ファイルとして存在してほしい template

この 2 つを分けることで、後から挙動を更新しやすくしつつ、正本の位置も分かりやすくできます。

## AI 支援開発の repo で効く理由

AI 支援開発では、doc、prompt、rule、command、local workflow file が増えやすく、repo drift が起きやすくなります。

その環境で役に立つ標準導入ツールは、少なくとも次を満たす必要があります。

- write 前に実差分を見せる
- managed boundary を明確にする
- destructive upgrade を default にしない
- quality 系の導入を通常の review で見切れる大きさに保つ

`project-standards` は、これらを後付けの例外ではなく、最初から前提条件として扱っています。

## 実際の導入順

既存 repo に入れるときの安全な順番は、だいたい次のとおりです。

1. 現在の repo を見て、ローカルに残すものを決める
2. `diff` を取る
3. quality 系だけ `--dry-run` で当てる
4. team で review する
5. managed boundary に合意できたら real apply を実行する
6. stack 固有の follow-up は別 PR に分ける

## このページで伝えたいこと

この repo は単なる設定配布ではありません。既存 repo、複数ツール、AI 支援開発、partial ownership という現実の条件下で、標準導入を review-first に成立させるための platform として設計しています。
