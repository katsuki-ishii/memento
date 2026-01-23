# API ラフ案（REST）

## 認証

- Cognito Hosted UI + PKCE。
- Authorization: Bearer <access_token> を各リクエストに付与。

## エンドポイント

### GET /me/settings

- 応答: `{ "username": "", "birthYear": 1990, "lifespan": 85, "weekStart": "mon", "theme": "light", "createdAt": 1737600000000, "updatedAt": 1737600000000 }`

### PATCH /me/settings

- 入力: 同上フィールド（部分更新可）。
- 応答: 更新後の設定（`createdAt`/`updatedAt` を含む）。
- バリデーション: username/note 長さ、birthYear/lifespan の範囲、weekStart は `mon`/`sun`。

### GET /events?weekId=<number>

- 誕生日起点の週IDでフィルタし、配列を返す。
- 応答例: `[{ "id": "EVENT#1714123456789", "weekId": 1200, "title": "", "mood": "neutral", "note": "", "createdAt": 1714123456789 }]`

### POST /events

- 入力: `{ "weekId": number, "title": string, "mood": "very-bad"|"bad"|"neutral"|"good"|"very-good", "note": string }`
- 応答: 作成したイベント（id 付き）。

### PATCH /events/{id}

- 入力: POST と同じフィールドの部分更新。
- id は `EVENT#<timestamp>` 形式。

### DELETE /events/{id}

- 成功時 204。

## バリデーション / 計算メモ

- weekId: JST、週開始は月曜。誕生日からの経過日数を7で割った整数。
- id: Lambda 側で `EVENT#<timestamp>` を採番。
- title/note: 長さ上限を設定（例: title 100文字、note 1000文字）。
- mood: 定義済み列挙に限定。

## データモデル

- 詳細な PK/SK/GSI は `data-model.md` を参照。
