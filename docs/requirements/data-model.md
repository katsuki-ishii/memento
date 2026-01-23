# データモデル設計（DynamoDB 単一テーブル）

## テーブル

- 名前案: `memento-user-event-dev`（dev。環境ごとに suffix を分ける想定）
- パーティションキー (PK): `pk`
- ソートキー (SK): `sk`
- 主要属性: `weekId` (string), `username`, `birthYear`, `lifespan`, `weekStart`, `theme`, `title`, `mood`, `note`, `createdAt`, `updatedAt`
- TTL: 任意（現状なし）

## エンティティとキー

- UserSettings
  - pk: `USER#<sub>`
  - sk: `SETTINGS`
  - attrs: username, birthYear, lifespan, weekStart (mon/sun), theme, createdAt, updatedAt

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

- 現在はグリッドの週ID（`YYYY-WXX`）を使用。
- 誕生日からの経過週数の算出は将来対応。

## バリデーション指針

- note: 長さ制限なし（現状）。
- mood: 定義済みの列挙（例: very-bad〜very-good）。
- username/birthYear/lifespan/weekStart を設定時に検証。
