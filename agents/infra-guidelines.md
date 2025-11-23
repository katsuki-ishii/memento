# infra-guidelines.md

## 方針

- 個人開発のため IaC（CDK/Terraform）は不使用。AWS コンソールで最小構成を手動作成。
- 設定内容は docs にメモして再現性を担保。

## 手動セットアップの目安

- Cognito: User Pool + App Client(PKCE) + ドメイン、リダイレクト/ログアウト URL 設定。
- API Gateway(REST): ステージ・CORS 設定、Lambda 統合、環境変数でバックエンドを切替。
- Lambda: Node 22 ランタイム、`DYNAMO_TABLE_MEMENTO` など環境変数、最小ポリシー。
- DynamoDB: テーブル作成（PK/SK）、TTL や GSI が必要なら設定。

## CI/CD

- lint/format のみ GitHub Actions で実行（デプロイは手動）。
