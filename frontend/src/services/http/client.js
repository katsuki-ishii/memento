/**
 * HTTP クライアント
 * API への HTTP リクエストを送信するためのユーティリティ関数を提供します
 */

/**
 * API のベース URL を取得
 * 環境変数 VITE_API_BASE_URL が設定されていればそれを使用、
 * なければダミーの URL を返します（開発用）
 */
const getBaseUrl = () => {
  // 将来的に VITE_API_BASE_URL を参照する想定
  return import.meta.env.VITE_API_BASE_URL || 'https://example.invalid';
};

/**
 * JSON 形式で API リクエストを送信
 * レスポンスも JSON としてパースして返します
 *
 * @param {string} path - API のパス（ベース URL は自動的に付与されます）
 * @param {Object} options - fetch のオプション（method、headers、body など）
 * @returns {Promise<Object>} パースされた JSON レスポンス
 * @throws {Error} リクエストが失敗した場合（ステータスコードが 200-299 以外）
 */
const fetchJson = async (path, options = {}) => {
  const fetcher = typeof globalThis !== 'undefined' && globalThis.fetch ? globalThis.fetch : null;
  if (!fetcher) {
    throw new Error('fetch is not available');
  }

  // ベース URL とパスを結合してリクエストを送信
  const res = await fetcher(`${getBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // オプションで指定されたヘッダーをマージ（認証トークンなど）
      ...(options.headers || {}),
    },
    ...options,
  });

  // レスポンスボディをテキストとして取得してから JSON にパース
  // 空のレスポンスの場合は null を返します
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  // エラーレスポンス（ステータスコードが 200-299 以外）の場合はエラーをスロー
  if (!res.ok) {
    const err = new Error('Request failed');
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
};

export { fetchJson };
