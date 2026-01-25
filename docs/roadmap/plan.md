# ロードマップ開発計画

## 目的

- ロードマップ機能のWBSと進捗管理の基盤を示す。

## 運用方針

- 1機能ごとに「仕様 → 実装 → 検証 → 記録」の流れで整理する。
- 仕様は `docs/roadmap/<日付>_<機能名>/spec.md` を一次情報とする。
- 親タスクの日時は「実装日」ではなく「タスク登録日」として扱う。
- 親タスクに登録日（YYYY-MM-DD）を付与し、履歴性を担保する。
- MVPと同じ3層チェックリストで「実装機能単位」に分解する。

## ロードマップ WBS（チェックリスト・3層）

- [x] 2026-01-23 感情スコアによるグリッド色分け
  - [x] 仕様整理
    - [x] `docs/roadmap/2026-01-23_感情スコアによるグリッド色分け/spec.md` を参照し要件を確認
    - [x] mood の値（`very-bad`〜`very-good`）と色のマッピングを定義
    - [x] 仕様上の注意点（現在週はアクセント優先、イベント未登録は過去/未来色）を確認
  - [x] バックエンド実装
    - [x] `GET /events` の weekId 省略時に全イベント取得を許可
    - [x] `listAllEvents` を追加しユーザー単位でイベント全件を取得
    - [x] 既存 `listEventsByWeek` と分岐を整理
  - [x] フロントエンド実装
    - [x] ダッシュボード初期表示で `listEvents()` を呼び出して全件取得
    - [x] 週IDをキーに `eventsByWeek` へ保存
    - [x] Grid の `weekClass` で感情スコア色を適用
    - [x] 凡例に感情スコアの説明を追加
  - [x] 動作確認
    - [x] 既存イベントのある週が緑系の濃淡で表示される
    - [x] 現在週はイベント有無に関わらずアクセント色を優先
    - [x] イベント未登録の過去/未来がグレーで表示される
  - [x] 記録
    - [x] 実装内容をコミットメッセージに整理（実装手順の記録）

- [ ] 2026-01-25 多言語対応
  - [x] 仕様/設計
    - [x] `docs/roadmap/2026-01-25_多言語対応/spec.md` を作成
    - [x] `docs/roadmap/2026-01-25_多言語対応/design.md` を作成
    - [x] 翻訳キーの命名ルールを確定（common/login/errors/toast）
  - [ ] バックエンド実装
    - [x] `UserSettings` に `locale` 属性を追加（永続化対応）
    - [x] `GET /me/settings` の `locale` 返却を追加
    - [x] `PATCH /me/settings` で `locale` を検証・保存
    - [x] バリデーション: `ja` / `en` 以外は 400
  - [ ] フロントエンド基盤
    - [x] Vue i18n を導入
    - [x] 翻訳辞書（`ja.json` / `en.json`）を作成
    - [x] 初期言語の判定ロジックを実装（保存値 → ブラウザ → `en`）
    - [x] `<html lang>` を `locale` に同期
  - [ ] フロントエンドUI
    - [x] 設定画面に言語セレクトを追加（日本語 / English）
    - [x] 保存時に `locale` を `/me/settings` に送信
    - [x] 主要画面の文言をキー参照に置換（home/auth/setup/dashboard/settings）
    - [x] エラーメッセージ/トースト文言をキー参照に置換
  - [ ] 動作確認
    - [ ] 保存済み `locale` がある場合に即時反映される
    - [ ] 未設定時はブラウザ言語で初期化される
    - [ ] 未対応言語は `en` にフォールバックする
    - [ ] 設定保存後の再読込で言語が維持される
  - [ ] 記録
    - [ ] 実装内容をコミットメッセージに整理（実装手順の記録）

- [x] 2026-01-25 本番環境デプロイ対応（CloudFront + localhost 両対応）
  - [x] 問題の特定
    - [x] CloudFrontからアクセス時にCognito認証後のリダイレクトがlocalhostに向かう問題
    - [x] CORSエラー: API Gatewayが `localhost:5173` のみを許可していた問題
  - [x] フロントエンド修正
    - [x] `frontend/.env.local` から `VITE_COGNITO_REDIRECT_URI` / `VITE_COGNITO_LOGOUT_REDIRECT_URI` を削除
    - [x] `authService.js` の `getRedirectUri()` が動的に `globalThis.location.origin` を使用するように
    - [x] フロントエンドを再ビルドしてS3にデプロイ
  - [x] バックエンド修正
    - [x] `backend/src/lib/response.js` でカンマ区切りの複数CORSオリジンをサポート
    - [x] `getOriginFromEvent()` ヘルパー関数を追加
    - [x] 各ハンドラー（settings.js, events.js, health.js）でリクエストOriginを渡すように修正
    - [x] `template.yaml` のAPI Gateway CORS preflight設定を `'*'` に変更
    - [x] SAMデプロイ時に `CallbackUrls`, `LogoutUrls`, `CorsAllowOrigin` パラメータオーバーライドで複数URL指定
  - [x] デプロイ手順のドキュメント化
    - [x] `AGENTS.md` にフロントエンド・バックエンドのデプロイコマンドを追加
    - [x] `.cursor/rules/core.mdc` にも同期
  - [x] 動作確認
    - [x] CloudFrontからログイン→ダッシュボード遷移が正常動作
    - [x] localhostからも引き続き正常動作

- [ ] 2026-01-25 グラフ可視化

- [ ] 2026-01-25 データエクスポート
