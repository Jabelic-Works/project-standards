# 基本概念

## まず押さえる考え方

`project-standards` は、リポジトリ標準を名前付きの preset として管理します。

preset には、どの template file をどこへ適用するかと、その変更を安全に適用してよいかを決めるルールが含まれます。

## Preset

preset は、template file 群とそのメタデータをまとめた名前付きの単位です。

現在このリポジトリが提供している preset は、`templates/base/preset.json` で定義される `base` です。

preset の各 entry には、次の情報が入ります。

- `templates/<preset>/files/` 配下の source file
- 更新対象リポジトリ内での target path
- 安全に適用してよいかを決める file strategy
- `quality` や `ai` のような段階適用用の tag

## 安全性のモデル

現在の preset では 2 種類の strategy を使っています。

- `create_if_missing`: file が存在しないときだけ作る
- `replace_if_managed`: managed marker が入っているときだけ置き換える

この設計により、新規リポジトリにも既存リポジトリにもレビューしやすい形で適用できます。

## Managed marker

managed file には `managed-by: @jabelic/standards` という marker を入れます。

file にこの marker がある場合、将来の実行でも安全にその file を置き換えられます。
marker がない場合は repository-owned とみなし、`--force` なしでは置き換えません。

## Shared config package

一部の generated file は、設定の中身を各リポジトリへ大量にコピーする代わりに、このモノレポの shared package を参照する薄い entrypoint になっています。

これにより標準設定を中央管理しやすくなりますが、target repository 側では参照先の dependency を install しておく必要があります。
