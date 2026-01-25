# Memento - あなたの人生を週単位で

Mementoは、人生を週単位で可視化するウェブアプリです。Tim Urban氏の _Wait But Why_ 「Your Life in Weeks」にインスパイアされ、寿命年数×52週のグリッドで現在地と過去/未来を俯瞰します。/

---

## 機能

- **ホーム（非認証）**: コンセプト紹介とCTA（サインアップ/ログイン）。
- **認証**: Cognito Hosted UI + PKCE。成功後は初期設定へ（設定済みならホームへ直行）。
- **初期設定**: username / birthYear / lifespan / weekStart / theme を入力し保存。
- **ライフグリッド**: 寿命年数×52週のセル表示。JST・週開始は月曜。現在週ハイライト、過去/未来を色分けして時間の有限性を可視化。
- **イベント記録**: 週セルからタイトル/メモ/感情スコアをCRUD。
- **ユーザー設定**: 後から再編集可能。保存内容はグリッドと計算に反映。
- **データ永続化**: DynamoDB 単一テーブル。API Gateway＋Lambda 経由で取得/更新/削除。

---

## 技術スタック

- **フロントエンド**: Vue 3 + JavaScript (Composition API)、Vite、Vue Router、Tailwind CSS。
- **状態管理**: Pinia（認証・設定・イベントを分離予定）。
- **認証**: Amazon Cognito Hosted UI (PKCE)。トークンは短期保持し、localStorage への保存は最小限に抑える。
- **バックエンド**: API Gateway (REST) → Lambda (Python) → DynamoDB 単一テーブル。
- **その他**: ESLint + Prettier、Husky、GitHub Actions（lint/format）。

---

## 使い方

1. **ホームでCTAをクリック**: 「サインアップ」または「ログイン」から認証フローへ。
2. **サインアップ / ログイン**: Cognito Hosted UI で完了。戻り後にトークンを取得。
3. **初期設定を入力**: username・生年・寿命・週開始・テーマを保存。完了でホームへ。
4. **ホームを見る**: 寿命×52週グリッドで現在週を確認し、過去（使った時間）と未来（残りの時間）を色分け表示。
5. **イベントを記録・編集**: 週セルをクリックしてイベントを追加/更新/削除。
6. **設定を再編集**: 必要に応じて設定ページで更新。ログアウトはサイドメニューから。
