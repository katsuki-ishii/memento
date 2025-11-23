# Progress Log (2025-11-23)

## 1. 要件整理

- 要件をジャンル別に docs/requirements 以下へ分割（functional, non-functional, user-stories, ux, mvp, screens, pages/\*, data-api, data-model）。
- ゴール機能を非MVPとして除外し、要件・用語集・API定義から削除。
- ライフグリッドは「ユーザー設定の寿命×52週」に統一、weekId を誕生日起点の経過日数/7（JST・月曜開始）で算出。
- イベントはタイトル/メモ/感情スコアのみ（タグなし）に整理。
- デザイン方針: Notionライクの白黒基調、余白広め、最小アクセント。
- 画面仕様強化: 認証後トップ、ダッシュボード、イベント編集、設定、ナビ（サイドメニューボタンで開閉、ダッシュボード/設定/ログアウト）。

## 2. データモデル / API

- data-model.md: DynamoDB 単一テーブル設計（PK=USER#sub, SK=SETTINGS / EVENT#timestamp）、GSI1 週別クエリ案、アクセスパターンとバリデーション指針を追加。
- data-api.md: REST エンドポイント骨子（/me/settings, /events CRUD）、リクエスト/レスポンス例、weekId計算・ID採番・バリデーションメモを分離整理。

## 3. ページ要件

- pages/\* で各画面の詳細要件を作成（dashboard, settings, event-dialog, auth, home）。
- ダッシュボードに寿命進捗指標（残り週/日/% と記録済み週数）を追加。

## 4. デザイン・ナビゲーション

- サイドメニューは左上ボタンで開閉し、ダッシュボード/設定/ログアウトを配置。トップでは初期非表示可。

## 5. 進捗（plan.md 反映済み）

- 要件/UX: MVP線引き、用語・ストーリー、主要画面ラフ、非機能ドラフト完了。画面遷移図のみ未。
- 設計: データモデル設計は完了。API OpenAPIドラフト・認証フロー設計は未。
- 環境: lint/format/Husky/commitlint など準備済み。フロント初期化とテスト設定は未。
- デプロイ: AWS CLI 手動方針。具体手順・PITR/ロールバックは未。

## 6. 今日の主コミット

- docs: split requirements into genre files
- docs: make life grid length user-configurable
- docs: add post-login top screen spec
- docs: add side-menu navigation for dashboard/settings
- docs: add per-page requirements
- docs: add detailed dynamodb data model
- docs: separate data model and api specs
- docs: add design theme (notion-like b&w)
- docs: add life-progress metrics to dashboard

## 7. 次の候補タスク

- OpenAPIドラフト作成
- Cognito PKCEフロー図とトークン保持ポリシー策定
- フロント初期化（Vite+Vue3+JS、Tailwind/Vitest導入、`npm run dev/test` 確認、pre-commitにtest追加）
- 画面遷移図テキスト化
- DynamoDB バックアップ/PITR・ロールバック手順のメモ
