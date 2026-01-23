# Lambda ルール

## 原則

- 1 Lambda = 1責務（1ユースケース / 1ドメイン単位を目安）
- ルートごとに責務を分け、デプロイ単位を明確にする

## 分割の判断基準

以下のいずれかに該当したら、Lambda分割を検討する。

- 変更頻度が明確に異なる（例: 設定APIは安定だがイベントは頻繁）
- 権限を分離したい（DynamoDBテーブルやS3等のアクセス）
- 障害影響範囲を減らしたい
- デプロイやロールバックを独立させたい

## 命名・構成

- Lambda名: `<project>-<domain>`（例: `memento-settings` / `memento-events`）
- ハンドラ: `handlers/<domain>.handler`
- ルート: `/me/settings` → settings系、`/events` → events系

## API Gateway との関係

- API Gateway は「入口」、Lambda は「処理担当」
- API Gateway のルートは責務単位で Lambda に振り分ける
- 入口と処理は分離されており、API Gateway単体では処理できない

## 権限（SAM Policies）

- 最小権限を基本とする
- 例: `DynamoDBCrudPolicy` は必要なテーブルのみに付与
- 分割後はLambdaごとに個別ポリシーを設定する
