# 設定画面要件

- 目的: ユーザー設定を編集し、グリッド表示・計算に反映する。
- フィールド: username, birthYear, lifespan(年), weekStart(初期:月曜), theme。
- 操作: 保存で設定更新（API PATCH /me/settings）。キャンセル/戻るで破棄。
- ナビ: サイドメニューボタンで開閉。項目: ダッシュボード/設定/ログアウト。
- 認証: 必須。
- スタイル: Notionライク白黒。
