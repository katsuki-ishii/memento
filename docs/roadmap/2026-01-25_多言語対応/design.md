# 多言語対応 設計

## 目的

- 仕様（spec.md）を実装可能な形に落とし込む。
- 追加するデータ/API/UI/ロジックの責務を明確化する。

## データ設計

- `UserSettings` に `locale` を追加する。
  - 値: `ja` / `en`
  - 未設定は `null` または未存在を許容。
- 既存ユーザーは `locale` 未設定のまま読み込み可能とする。

## API設計

### GET /me/settings

- 返却: `locale` を含める。
- 未設定時は `locale: null`（またはフィールド欠落）を許容。

### PATCH /me/settings

- 入力: `locale` を部分更新として許可。
- バリデーション: `ja` / `en` のみ許可。その他は 400。

## フロント設計

### i18n の導入

- Vue i18n を導入する。
- 例: `frontend/src/i18n/messages/ja.json`, `frontend/src/i18n/messages/en.json`
- 文字列はキーで参照し、キー命名は spec のルールに従う。

### locale 決定フロー

1. 設定取得で `locale` があれば採用。
2. 未設定（`null`/未存在）の場合は `navigator.languages` / `navigator.language` を参照。
3. 対応言語に一致しない場合は `en` にフォールバック。
4. 初回判定結果を `/me/settings` に保存し、以後は保存値を優先。

### 反映

- 言語切り替えは即時反映（リロード不要）。
- `<html lang>` を `locale` に合わせて更新。

### 設定画面

- 言語セレクトを追加（`日本語` / `English`）。
- 保存時に `locale` を含めて PATCH。

## 実装メモ

- i18n ロジックは composable に寄せる（frontend-guidelines に従う）。
  - 例: `useLocale()` で初期判定・切替・保存を扱う。
- 既存の文言を段階的に外部化し、画面単位に移行する。

## 影響範囲

- バックエンド: `settings` のバリデーションと永続化
- フロント: i18n 初期化、設定画面 UI 追加、文言の外部化
- ドキュメント: `spec.md` と `design.md` の同期
