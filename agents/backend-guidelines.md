# backend-guidelines.md

## 前提

- サーバーレス（API Gateway REST → Lambda(Node.js) → DynamoDB）。デプロイは手動を想定。

## ハンドラ設計

- 共通: 入力検証、認証(JWT)、エラーハンドリング、ログをユーティリティ化。
- 環境変数: `DYNAMO_TABLE_MEMENTO`, `AWS_REGION`, `API_STAGE` などを使用。
- レスポンスは JSON、`statusCode` と body を明示。CORS ヘッダを付与。

## データモデル(案)

- PK/SK でマルチテナント: `PK = USER#<sub>`, `SK = EVENT#<timestamp>` など。目標や設定も同一テーブルでタイプ分け。
- 必要に応じて GSI を検討（例: 目標の並び替え用）。

## セキュリティ

- JWT 検証（Cognito public keys）。入力はサニタイズ/検証（zod 等）。
