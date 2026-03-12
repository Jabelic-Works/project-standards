# 基本概念

## 設計目標

- 新規リポジトリと既存リポジトリの両方を扱えること
- 可能な限り冪等に振る舞うこと
- `diff` と `--dry-run` をレビューの基本経路にすること
- リポジトリ固有のファイルをデフォルトで壊さないこと
- 今後の stack 拡張や preset 拡張をしやすくしておくこと

## Preset

preset は、template file 群とそのメタデータをまとめた名前付きの単位です。

現在このリポジトリが提供している preset は 1 つだけで、`templates/base/preset.json` で定義される `base` です。

preset の各 entry には、次の情報が入ります。

- `templates/<preset>/files/` 配下の source file
- 更新対象リポジトリ内での target path
- 安全に適用してよいかを決める file strategy
- `quality` や `ai` のような段階適用用の tag

## File strategy

現在の MVP では 2 種類の strategy を使っています。

- `create_if_missing`: file が存在しないときだけ作る
- `replace_if_managed`: managed marker が入っているときだけ置き換える

この設計により、既存リポジトリを壊しにくくしつつ、standards 管理下の file だけは後から更新できるようにしています。

## Managed marker

managed file には `managed-by: @jabelic/standards` という marker を入れます。

file にこの marker がある場合、planner は将来の実行でその file を置き換えられます。
marker がない場合は repository-owned とみなし、`--force` なしでは置き換えません。

## Shared config package

一部の generated file は、設定の中身を各リポジトリへ大量にコピーする代わりに、このモノレポの shared package を参照する薄い entrypoint になっています。

これにより標準設定を中央管理しやすくなりますが、MVP 時点では target repository 側の dependency installation がまだ未実装である、という前提も生まれています。
