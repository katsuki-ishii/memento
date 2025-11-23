# frontend-guidelines.md

## 構成

- `frontend/` を想定: `src/views`, `src/components`, `src/router`, `src/composables`, `src/lib`, `src/assets`。
- ルーター: 認証必須ルートはガードで保護。未ログインはログイン画面へリダイレクト。

## 状態管理

- Pinia を想定。認証情報・ユーザー設定・イベント/目標はストア分割。永続化は localStorage しすぎない（トークンは Cognito PKCE を基本に）。

## UI/UX

- ライフグリッドは週単位のセルを色分け。キーボード操作とコントラスト確保。
- フォーム: バリデーションとエラーメッセージを即時表示。

## API 連携

- API クライアントは `src/lib/api` にまとめ、型付きレスポンス。失敗時はユーザーにわかるメッセージ + ログ。

## スタイル

- Tailwind ユーティリティ。共通トークンは `:root` カスタムプロパティか Tailwind テーマ拡張で定義。
