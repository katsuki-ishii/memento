# データモデル & API ラフ案

## エンティティ（DynamoDB 想定）

- UserSettings: PK `USER#<sub>`, SK `SETTINGS`; fields: username, birthYear, lifespan, weekStart (mon), theme.
- Event: PK `USER#<sub>`, SK `EVENT#<timestamp>`; fields: weekId, mood, note, createdAt.

## REST エンドポイント（骨子）

- GET /me/settings, PATCH /me/settings
- GET /events?week=YYYY-Www, POST /events, PATCH /events/{id}, DELETE /events/{id}
- (認証) Cognito Hosted UI + PKCE, トークンは Authorization: Bearer で送信

## バリデーションのメモ

- weekId は誕生日からの経過週（週開始は月曜、JST基準）。
- note は長さ制限を設け、サニタイズ。
