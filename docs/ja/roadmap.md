# ロードマップ

## すでに実装済み

- pnpm workspace と TypeScript project reference
- base preset manifest と template file
- diff 可能な plan / apply engine
- 最小限の shared config package
- `init`、`apply`、`diff` を備えた安全な CLI

## 後続対応にしているもの

- base preset を超えた stack composition
- target repository 内での package manager / dependency mutation
- partially managed file に対する richer merge strategy
- stack-specific quality tool に対する `doctor` check
- managed file や preset version を更新する `upgrade` flow

## 将来的にありそうな拡張

- `react`、`vue`、`library` などの追加 preset
- `react-doctor`、`vue-doctor`、`knip`、`secretlint`、`markdownlint`、`publint`、`tsc --noEmit` などへの doctor integration
- さらに多くの shared config package と stack plugin
- リポジトリごとに PR しやすい change plan の生成
