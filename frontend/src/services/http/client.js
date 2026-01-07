/**
 * HTTP クライアント
 * API への HTTP リクエストを送信するためのユーティリティ関数を提供します
 */

import { useAuthStore } from '../../stores/auth';
import { useUiStore } from '../../stores/ui';
import { refreshSession } from '../authService';

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
 * 認証開始ページへのリダイレクト URL を構築
 * 現在のパスを redirect クエリで保持します
 */
const buildAuthStartRedirect = () => {
  if (typeof globalThis === 'undefined' || !globalThis.location) return '/auth/start';
  const { pathname, search, hash } = globalThis.location;
  const current = `${pathname}${search}${hash}`;
  const redirect = encodeURIComponent(current || '/');
  return `/auth/start?redirect=${redirect}`;
};

/**
 * 認証切れ時の共通処理
 *
 * @param {Error} error - エラー情報
 */
const handleUnauthorized = (error) => {
  const auth = useAuthStore();
  const ui = useUiStore();

  auth.clearSession();
  ui.pushToast({
    title: 'セッションが切れました',
    message: '再ログインしてください。',
    variant: 'error',
  });

  const redirectUrl = buildAuthStartRedirect();
  if (typeof globalThis?.location !== 'undefined') {
    globalThis.location.assign(redirectUrl);
  } else if (globalThis?.console) {
    globalThis.console.warn('Unable to redirect to auth start', error);
  }
};

/**
 * JSON 形式で API リクエストを送信
 * レスポンスも JSON としてパースして返します
 *
 * @param {string} path - API のパス（ベース URL は自動的に付与されます）
 * @param {Object} options - fetch のオプション（method、headers、body など）
 * @param {boolean} options.withAuth - 認証ヘッダーを付与するか（デフォルト: true）
 * @param {boolean} options.retryOnAuthFailure - 401 時に再試行するか（デフォルト: true）
 * @returns {Promise<Object>} パースされた JSON レスポンス
 * @throws {Error} リクエストが失敗した場合（ステータスコードが 200-299 以外）
 */
const fetchJson = async (path, options = {}) => {
  const { withAuth = true, retryOnAuthFailure = true, ...fetchOptions } = options;
  const fetcher = typeof globalThis !== 'undefined' && globalThis.fetch ? globalThis.fetch : null;
  if (!fetcher) {
    throw new Error('fetch is not available');
  }

  const auth = useAuthStore();
  auth.hydrateFromStorage();

  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  };

  if (withAuth && auth.accessToken) {
    headers.Authorization = `Bearer ${auth.accessToken}`;
  }

  // ベース URL とパスを結合してリクエストを送信
  const res = await fetcher(`${getBaseUrl()}${path}`, {
    headers,
    ...fetchOptions,
  });

  if (res.status === 401 && withAuth && retryOnAuthFailure) {
    try {
      const refreshed = await refreshSession({ redirectOnFail: false });
      if (refreshed?.refreshed) {
        return fetchJson(path, { ...options, retryOnAuthFailure: false });
      }
    } catch (error) {
      handleUnauthorized(error);
    }
  }

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
