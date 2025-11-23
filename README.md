# Memento

ライフカレンダー（81年×52週）で人生の進捗を見える化し、目標設定とイベント記録を行うアプリ。Cognito 認証、API Gateway + Lambda、DynamoDB を組み合わせた構成を想定。

## 初期セットアップ（予定）

- Node.js 18+（`nvm use 20` など）
- パッケージインストール: `npm install`
- 開発サーバ: `npm run dev`
- 環境変数: `.env.example` を基に `.env.local` を作成（Cognito/APIエンドポイント等）

## ディレクトリ（計画）

- `frontend/`: Vue 3 + Vite + TS, Tailwind
- `api/`: Lambda ハンドラと共通ライブラリ
- `infra/`: CDK/Terraform で Cognito, API Gateway, Lambda, DynamoDB
- `docs/`: 要件・計画・ADR
