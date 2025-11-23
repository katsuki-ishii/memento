# データモデル設計（DynamoDB 単一テーブル）

## テーブル

- 名前案: `Memento`
- パーティションキー (PK): `pk`
- ソートキー (SK): `sk`
- 主要属性: `weekId` (number), `username`, `birthYear`, `lifespan`, `weekStart`, `theme`, `title`, `mood`, `note`, `createdAt`
- TTL: 任意（現状なし）

## エンティティとキー

- UserSettings
  - pk: `USER#<sub>`
  - sk: `SETTINGS`
  - attrs: username, birthYear, lifespan, weekStart (mon), theme, createdAt

- Event
  - pk: `USER#<sub>`
  - sk: `EVENT#<timestamp>` (timestamp ms for uniqueness)
  - attrs: title, weekId, mood, note, createdAt

## GSI（週別イベント一覧用）

- GSI1
  - gsi1pk: `WEEK#<weekId>`
  - gsi1sk: `USER#<sub>#EVENT#<timestamp>`
  - 用途: 週単位のイベント取得。ユーザーIDで前方一致フィルタも可能。

## アクセスパターン

1. 設定取得/更新
   - Get: pk=`USER#<sub>`, sk=`SETTINGS`
   - Put/Update: 同キー

2. 週のイベント一覧（ユーザー視点）
   - Query pk=`USER#<sub>` with sk begins_with `EVENT#` + Filter weekId=…（件数少ならこれで可）
   - もしくは GSI1: gsi1pk=`WEEK#<weekId>`, gsi1sk begins_with `USER#<sub>#`

3. イベント単体取得/削除
   - Get/Delete pk=`USER#<sub>`, sk=`EVENT#<timestamp>`

## weekId の算出

- JST基準、週開始は月曜。
- 誕生日からの経過日数 / 7 の整数値。
- クライアントとバックエンドで同一ロジックを共有する（ユーティリティ化）。

## バリデーション指針

- note: 長さ上限を設定（例: 1000文字）。
- mood: 定義済みの列挙（例: very-bad〜very-good）。
- username/birthYear/lifespan/weekStart を設定時に検証。
