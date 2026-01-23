# 非機能要件 (Non-Functional)

- パフォーマンス: ライフグリッド初期表示 < 500ms（dev 環境目安）、操作時は 100ms 以内の反応を目標。
- 可用性/復旧: 個人開発のため SLA は設けないが、DynamoDB PITR を有効化する前提で手動復旧可能とする。
- セキュリティ: Cognito トークン検証を API Gateway/Lambda で実施。PII をログに残さない。HTTPS 前提。
- コスト: 月額最小を目標（Cognito/Lambda/DynamoDB の無料枠内運用を優先）。
- 観測性: Lambda ログに requestId を含め、主要エラーは構造化ログで出力。
- 保守性: ESM + JS、Prettier/ESLint で統一。ドキュメントは docs/requirements 配下で更新。
