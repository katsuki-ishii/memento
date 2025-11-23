# 開発計画

## 目的
- Memento 初期開発のWBSと進捗管理の基盤を示し、AGENTS.mdの運用ガイドに沿って作業を進める。

## WBS（チェックリスト）
- [ ] プロジェクト準備
  - [ ] GitHubリポジトリ作成（privateで開始、公開可否は後で判断）
  - [ ] `main`/`dev` ブランチ作成と保護設定（必須レビュー・CI必須）
  - [ ] Git設定確認（user.name / user.email、改行LF固定）
  - [ ] PowerShellのUTF-8実行確認（`chcp 65001` 相当、`[Console]::OutputEncoding` 設定）※AGENTS.md参照
  - [ ] Node.js LTS (>=18) インストールし、`.nvmrc` or `.node-version` を配置
  - [ ] パッケージマネージャ決定（npm/pnpm）と `package.json` 初期化
  - [x] `.gitignore` 追加（node_modules, dist, .env.local など）
  - [x] `.editorconfig` 追加（2スペース、UTF-8、LF）
  - [ ] ESLint + Prettier 設定雛形追加（Vue/TS 用）
  - [ ] commitlint + Conventional Commits ルール導入
  - [ ] Husky 設定：`pre-commit` で lint/format、`commit-msg` で commitlint 実行
  - [x] README 叩き台作成（概要・セットアップ手順・スクリプト一覧）
  - [x] ライセンス選定・`LICENSE` 配置（未定なら TODO を明記）
  - [ ] Issue/PR テンプレート用意（.github/ISSUE_TEMPLATE, PULL_REQUEST_TEMPLATE）
  - [ ] エディタ/ターミナルでUTF-8保存と表示を確認（AGENTS.mdの推奨どおり `Set-Content -Encoding utf8` 等を使う）
- [ ] 要件・UX確定
  - [ ] ユーザーストーリーと言葉の定義を明文化
  - [ ] 画面ラフ・遷移図（認証・ライフグリッド・目標・イベント編集）作成
  - [ ] MVP 範囲を決定し、後続機能と切り分け
- [ ] 設計
  - [ ] OpenAPIでAPI契約を作成しレビュー
  - [ ] DynamoDB テーブル設計（PK/SK、GSI、TTL）とアクセスパターン表を作成
  - [ ] 認証/認可フロー（Cognito Auth Code + PKCE、トークン保持）を図解
  - [ ] 非機能要件（性能・コスト・監視）を確定
- [ ] 開発環境構築
  - [ ] Vite + Vue3 + TypeScript プロジェクト生成、`npm install`
  - [ ] Tailwind 設定、Vitest 導入、`.env.example` 用意
  - [ ] Husky等で pre-commit に lint/format/test をフック
- [ ] フロントエンド実装 (MVP)
  - [ ] レイアウト/テーマ、ルーターと保護ルート、状態管理(Pinia想定)
  - [ ] 認証UI（サインアップ/ログイン/ログアウト）とトークンリフレッシュ
  - [ ] ライフグリッド表示、目標設定フォーム、イベント CRUD UI、APIクライアント層
- [ ] バックエンド/API
  - [ ] Lambda ハンドラ雛形、DTOバリデーション、共通ログ/エラーハンドリング
  - [ ] イベント CRUD・目標 CRUD・ユーザー設定取得/更新を実装
  - [ ] Cognito JWT 検証ミドルウェアと権限チェック
- [ ] インフラ/IaC
  - [ ] CDK/Terraform で Cognito, API Gateway(REST), Lambda, DynamoDB を定義
  - [ ] 環境別設定（dev/prod）と CORS/デプロイステージを整備
  - [ ] CI/CD パイプライン雛形（lint/test/build/deploy）を GitHub Actions 等で用意
- [ ] テスト
  - [ ] 単体テスト（Vitest）カバレッジ目標設定とガイド作成
  - [ ] API コントラクトテスト、ローカル統合（LocalStack or mock）方針を決定
  - [ ] 簡易E2E計画（Playwright/Cypress）とスモーク項目を定義
- [ ] 運用・リリース
  - [ ] 監視/アラート（CloudWatch Logs/Alarms）、エラートラッキング方針を決定
  - [ ] バックアップ/リカバリ手順（DynamoDB PITR）を整理
  - [ ] リリース手順とロールバック手順を記述
- [ ] リスクと対応
  - [ ] 認証フロー複雑化 → 初期は Email/Password + PKCE に限定
  - [ ] DynamoDB 設計ミス → アクセスパターン表をレビュー
  - [ ] フロント/バック並行開発 → OpenAPI 契約先行とモックAPI準備

## 環境準備チェックリスト
- [ ] Node.js LTS 18+ / npm または pnpm
- [ ] AWS CLI + 認証プロファイル設定、CDK/Terraform CLI
- [ ] Git フック実行権限、Docker（LocalStack 等を使う場合）
- [ ] `.env.example` から `.env.local` を作成（Cognito, API, DynamoDB 設定）
