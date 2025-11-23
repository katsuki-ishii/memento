# architecture.md

## 全体像

- フロント: Vue 3 + Vite + TS + Tailwind。認証は Cognito PKCE。API は REST。
- バック: API Gateway(REST) → Lambda(Node 22) → DynamoDB 単一テーブル設計（PK/SK）。
- デプロイ: 手動（個人開発）。CI は lint/format のみ。

## ドメイン（案）

- UserSettings: 生年/寿命/目標週など。
- Goal: 目標/カテゴリ/期限。
- Event: 週と関連付けた出来事ログ。

## 設計指針

- コントラクト先行: OpenAPI 下書きを作り、フロント/バックで共有。
- 単一責務: UI/ロジック/データアクセスを分離（Composable・ストア・API クライアント・Lambda 層）。
- バリデーション: 入力はフロント/バック両方でチェック。バックエンドはスキーマバリデーション必須。
- オブザーバビリティ: Lambda ログに相関ID（requestId）を含める。
