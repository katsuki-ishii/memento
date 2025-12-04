# 開発計画

## 目的

- Memento 初期開発のWBSと進捗管理の基盤を示し、AGENTS.mdの運用ガイドに沿って作業を進める。

## WBS（チェックリスト・3層）

- [x] プロジェクト準備
  - [x] リポジトリ/ブランチ運用
    - [x] GitHubリポジトリ作成（privateで開始、公開可否は後で判断）
    - [x] Git設定確認（user.name / user.email、改行LF固定）
    - [x] ブランチ保護ルール設定（main/dev で必須レビュー済み。ステータスチェックはCI導入後に追加）
  - [x] 基本ツール/設定
    - [x] `.gitignore` / `.editorconfig` 設置
    - [x] Node.js LTS (22) インストール & `.nvmrc` 設置確認
    - [x] パッケージマネージャ決定（npm 採用）と `package.json` 初期化
    - [x] PowerShell UTF-8 実行確認（`[Console]::OutputEncoding` / `chcp 65001`）
  - [x] コラボ基盤
    - [x] README 叩き台作成
    - [x] LICENSE 設置（MIT）
    - [x] Issue/PR テンプレート準備（.github/ISSUE_TEMPLATE, PULL_REQUEST_TEMPLATE）
    - [x] commitlint + Conventional Commits 導入
    - [x] Husky フック設定（`pre-commit` で lint/format、`commit-msg` で commitlint）
    - [x] ESLint + Prettier 設定（Vue/JS 用）
- [x] 要件・UX確定
  - [x] スコープ整理
    - [x] MVP / 非MVP を docs/requirements/mvp.md で切り分け
    - [x] 用語集とユーザーストーリーを docs/requirements で確定
  - [x] UX成果物
    - [x] 主要画面ラフ（docs/requirements/ux.md）
    - [x] 非機能要件ドラフト（性能・コスト・監視）
  - [x] ホーム/認証/初期設定/ダッシュボードの遷移フローを docs/requirements/pages・screens.md・OUTLINE.md に反映
- [x] 設計
  - [x] データモデル
    - [x] DynamoDB 設計（PK/SK/GSI/TTL）
    - [x] アクセスパターン表レビュー
  - [x] 認証/認可
    - [x] Cognito Auth Code + PKCE フロー図
    - [x] トークン保持/更新ポリシー
- [x] 開発環境構築
  - [x] フロント初期化
    - [x] Vite + Vue3 + JS プロジェクト生成
    - [x] Tailwind 設定
    - [x] Vitest 導入
  - [x] 設定/環境
    - [x] `.env.example` 作成
    - [x] lint/format スクリプト追加
    - [x] Tailwind `content` パス設定（`./index.html`, `./src/**/*.{vue,js,ts,jsx,tsx}`）
    - [x] ESLint を Vue 対応に拡張（eslint-plugin-vue 導入と `.vue` lint 対応）
    - [x] pre-commit で lint/format/test 実行（lint/format は実行済み、test は未設定）
  - [x] ランタイム確認
    - [x] `npm run dev` 起動確認
    - [x] `npm run test` 簡易実行
- [ ] フロントエンド実装 (MVP)
  - [ ] 基盤
    - [ ] レイアウト/テーマ
      - [x] Appシェル（header/main/footer）とダッシュボード専用サイドナビ/ハンバーガーを組み込み
      - [x] Tailwind テーマトークン定義と `data-theme` 切替（body反映）
      - [x] トースト/ローディングのグローバルコンポーネントをプレースホルダで配置（UIストア連携前提）
    - [ ] ルーター & 保護ルート（認証・初期設定ガード実装）
      - [x] `meta.requiresAuth/requiresSetup` を使った beforeEach ガード実装
      - [x] ガード中のローディング表示と `/error` フォールバック
    - [ ] 状態管理 (Pinia) ストア雛形作成
      - [x] `auth` / `profile` / `grid` / `ui` ストアの state・actions の枠と sessionStorage 永続化ラッパ
      - [x] 各ストアの Vitest スケルトン
  - [ ] 認証
    - [ ] サインアップ/ログイン/ログアウト UI
      - [ ] フォーム構造整理（Signup/Login 共通レイアウト・入力項目定義・ボタン配置）
      - [ ] バリデーション実装（必須/形式/長さ）と入力エラー表示
      - [ ] トースト連携（成功/失敗メッセージ、重複送信防止のロード状態）
      - [ ] Hosted UI 連携ボタンの配置と既存 `startHostedLogin` 呼び出し接続
      - [ ] ログアウト操作導線の設置（ヘッダー、サイドナビ）
      - [ ] ログアウト処理フロー整理（ストアクリア、リダイレクト、トースト通知）
  - [ ] UI修正
    - [x] サイドメニューが表示されない
      - [x] 原因: SideNav が `showNavButton && navOpen` 条件でレンダリングされ、`navOpen` 初期値 false のまま。デスクトップではトグルボタンが md:hidden のため開けず常に非表示。
    - [x] 対応デバイス方針: PC ブラウザのみを対象。レスポンシブ対応は不要（既存実装は影響しない範囲で残置可）
    - [x] Hosted UI 起動/コールバック stub（`startHostedLogin` / `handleCallback`）とルータ遷移分岐
    - [ ] トークンリフレッシュ/エラーハンドリング
      - [ ] refresh_token を使った更新処理の枠を authService に追加
      - [ ] 失効時の再ログイン誘導とトースト表示
  - [ ] 機能UI
    - [ ] ライフグリッド表示
      - [x] ダミー週データを Pinia から供給し、現在週ハイライト/イベント色分けの骨組みを実装
      - [ ] サマリー（記録週数・残り週数）のダミー計算と表示
      - [ ] `select-week` で選択週をストアに反映する
    - [ ] 目標設定フォーム
    - [ ] イベント CRUD UI
    - [ ] API クライアント層
      - [ ] http ラッパに Auth ヘッダー注入/エラー整形を実装
      - [ ] settingsService / eventsService の関数枠と JSDoc を用意
    - [ ] 設定フォーム骨組み（Setup）
      - [ ] username/birthYear/lifespan/weekStart/theme を profile ストアと双方向に接続（まだ API なし）
- [ ] バックエンド/API
  - [ ] 基盤
    - [ ] Lambda 雛形/共通ロガー/エラー応答
    - [ ] DTO バリデーション
  - [ ] 機能API
    - [ ] イベント CRUD 実装
    - [ ] 目標 CRUD 実装
    - [ ] ユーザー設定 取得/更新
  - [ ] 認証/認可
    - [ ] Cognito JWT 検証ミドルウェア
    - [ ] RBAC/スコープ定義（必要なら）
- [ ] デプロイ/インフラ
  - [ ] AWSコンソールで手動セットアップ
    - [ ] Cognito User Pool + App Client + ドメイン
    - [ ] API Gateway (REST) ステージ/CORS
    - [ ] Lambda 関数デプロイ（zip/inline）
    - [ ] DynamoDB テーブル作成（PK/SK/GSI/TTL）
  - [ ] CI/CD
    - [x] GitHub Actions (lint/format)
    - [ ] （任意）手動デプロイ手順メモ / 将来 CI へ統合
- [ ] テスト
  - [ ] 方針
    - [ ] カバレッジ目標策定
    - [ ] テスト命名/配置ルール記載
  - [ ] 実装
    - [ ] 単体テスト充実
    - [ ] API 契約テスト (mock/LocalStack)
    - [ ] E2E スモーク (Playwright/Cypress) 計画/一部実装
- [ ] 運用・リリース
  - [ ] 監視/運用
    - [ ] CloudWatch ログ/アラーム設計
    - [ ] エラートラッキング設定
  - [ ] 信頼性
    - [ ] DynamoDB PITR/バックアップ手順（AWS CLI で実施予定）
    - [ ] ロールバック手順
- [ ] リスクと対応
  - [ ] 認証フロー複雑化 → 初期は Email/Password + PKCE に限定
  - [ ] DynamoDB 設計ミス → アクセスパターンレビュー
  - [ ] 並行開発 → OpenAPI 契約先行 + モックAPI

## 環境準備チェックリスト

- [x] Node.js LTS 22+ / npm (nvmrc=22)
- [x] AWS CLI インストール & プロファイル確認（aws --version 2.31.8）
- [x] CDK / Terraform CLI（不使用と判断）
- [x] Docker（不使用と判断）
- [x] `.env.example` 作成 & `.env.local` 雛形配置











