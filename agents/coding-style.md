# coding-style.md

## 言語・共通

- JavaScript ES2022, ESM。インデント2スペース、シングルクォート、セミコロンあり、トレーリングカンマ推奨。
- Prettier で整形、ESLint で静的解析（`npm run format` / `npm run lint`）。
- ファイル名: コンポーネント PascalCase (`ProgressGrid.vue`)、Composable `useX.js`、ユーティリティは `verb-noun.js`。

## Vue (Composition API)

- `script setup` 推奨。props/emit を型付けしたい場合は JSDoc で注釈。
- 状態は Pinia ストアまたはローカル state。グローバル副作用を避け、Composable で共通化。
- コンポーネント分割は「1責務」。重い計算は `computed`、非同期は `async` 関数＋ローディング/エラー状態を明示。

## スタイル/Tailwind

- ユーティリティ優先。繰り返しは `@apply` か小コンポーネント化。
- アクセシビリティ: フォーム/ボタンに `aria-*`、ラベル関連付け、フォーカススタイル保持。

## API 呼び出し

- `src/services` （`services/http` など機能別サブディレクトリ推奨） にクライアント層を置き、`fetch` ラッパで共通ヘッダ（Auth）とエラーハンドリングを集約。
- 環境変数は Vite プレフィックス `VITE_` を使用。
