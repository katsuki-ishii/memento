# データモデル & API ラフ案

## エンティティ（DynamoDB 想定）

- UserSettings: PK `USER#<sub>`, SK `SETTINGS`; fields: username, birthYear, lifespan, weekStart (mon), theme.
- Event: PK `USER#<sub>`, SK `EVENT#<timestamp>`; fields: weekId, mood, note, createdAt.

## アクセスパターン / PK-SK 設計

- Get settings: PK=`USER#<sub>`, SK=`SETTINGS`
- Upsert settings: same key (PUT/UPDATE)
- List events by week: PK=`USER#<sub>`, SK begins_with `EVENT#` + filter on weekId (または GSI)
- Get event by id: PK=`USER#<sub>`, SK=`EVENT#<timestamp>`
- Delete event: same key delete

### GSI 案 (必要に応じて)

- GSI1 (by week): PK=`WEEK#<weekId>`, SK=`USER#<sub>#EVENT#<timestamp>` を Event に持たせる
  - クエリ: 週に紐づくイベント一覧（ユーザー単位 or 複数ユーザー拡張の余地）

## REST エンドポイント（骨子）

- GET /me/settings, PATCH /me/settings
- GET /events?weekId=<number>, POST /events, PATCH /events/{id}, DELETE /events/{id}
- (認証) Cognito Hosted UI + PKCE, トークンは Authorization: Bearer で送信

## バリデーション / 計算メモ

- weekId: 誕生日起点での経過日数を7で割った整数（JST、週開始は月曜）。
- event id: `timestamp`（ミリ秒）を SK に付与し一意にする。
- note 長さ制限とサニタイズを行う。
