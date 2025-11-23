# データモデル & API ラフ案

## エンティティ（DynamoDB 想定）

- UserSettings: PK `USER#<sub>`, SK `SETTINGS`; fields: username, birthYear, lifespan, weekStart, theme.
- Goal: PK `USER#<sub>`, SK `GOAL#<id>`; fields: title, category, targetYearWeek, status, createdAt.
- Event: PK `USER#<sub>`, SK `EVENT#<timestamp>`; fields: week, , mood, note, createdAt.

## REST エンドポイント（骨子）

- GET /me/settings, PATCH /me/settings
- GET /goals, POST /goals, PATCH /goals/{id}, DELETE /goals/{id}
- GET /events?week=YYYY-Www, POST /events, PATCH /events/{id}, DELETE /events/{id}
- (認証) Cognito Hosted UI + PKCE, トークンは Authorization: Bearer で送信

## バリデーションのメモ

- week は ISO 週形式を許容（例: 2025-05）。
- title/note は長さ制限を設け、tags はサニタイズ。
