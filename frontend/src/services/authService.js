/**
 * 認証サービス
 * AWS Cognito Hosted UI を使用した OAuth 2.0 認証フローを実装します
 * 環境変数が設定されていない場合は、開発用のスタブ動作を行います
 */

import { useAuthStore } from '../stores/auth';
import { useProfileStore } from '../stores/profile';

/**
 * ランダムなトークン文字列を生成
 * OAuth の state パラメータ（CSRF 対策）として使用します
 */
const randomToken = () => Math.random().toString(36).slice(2);

/**
 * 環境変数を取得
 * Vite の環境変数は import.meta.env からアクセスできます
 */
const getEnv = (key) => import.meta.env[key];

/**
 * 認証後のリダイレクト URI を取得
 * 環境変数で指定されていればそれを使用、なければ現在のオリジンから自動生成
 */
const getRedirectUri = () => {
  const configured = getEnv('VITE_COGNITO_REDIRECT_URI');
  if (configured) return configured;
  const origin =
    typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.origin : '';
  return origin ? `${origin}/auth/callback` : '/auth/callback';
};

/**
 * ログアウト後のリダイレクト URI を取得
 */
const getLogoutRedirectUri = () => {
  const configured = getEnv('VITE_COGNITO_LOGOUT_REDIRECT_URI');
  if (configured) return configured;
  const origin =
    typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.origin : '';
  return origin ? `${origin}/auth/start` : '/auth/start';
};

// OAuth state パラメータを保存するためのストレージキー
const stateStorageKey = 'memento_oauth_state';

/**
 * オブジェクトを URL クエリ文字列に変換
 * undefined や null の値は除外されます
 */
const buildQuery = (params) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

/**
 * Cognito Hosted UI の認証 URL を構築
 * OAuth 2.0 の認証コードフローに従って、認証ページへの URL を生成します
 */
const buildAuthorizeUrl = (state) => {
  const domain = getEnv('VITE_COGNITO_DOMAIN');
  const clientId = getEnv('VITE_COGNITO_USER_POOL_CLIENT_ID');
  if (!domain || !clientId) return null;

  const redirectUri = getRedirectUri();
  // スコープ: openid（OpenID Connect）、email、profile（ユーザー情報）、offline_access（リフレッシュトークン）
  const scope = getEnv('VITE_COGNITO_SCOPE') || 'openid email profile offline_access';
  const search = buildQuery({
    response_type: 'code', // 認証コードフローを使用
    client_id: clientId,
    redirect_uri: redirectUri,
    state, // CSRF 対策のためのランダムな文字列
    scope,
  });
  return `https://${domain}/oauth2/authorize?${search}`;
};

/**
 * Cognito Hosted UI のログアウト URL を構築
 */
const buildLogoutUrl = () => {
  const domain = getEnv('VITE_COGNITO_DOMAIN');
  const clientId = getEnv('VITE_COGNITO_USER_POOL_CLIENT_ID');
  if (!domain || !clientId) return null;
  const logoutUri = getLogoutRedirectUri();
  const search = buildQuery({
    client_id: clientId,
    logout_uri: logoutUri,
  });
  return `https://${domain}/logout?${search}`;
};

/**
 * 認証フローを開始
 * Cognito Hosted UI へのリダイレクトを行います
 * 環境変数が設定されていない場合は、開発用のスタブ動作（擬似リダイレクト）を行います
 *
 * @param {Object} options - オプション
 * @param {string} options.redirectUrl - 認証後のリダイレクト先（デフォルト: '/auth/callback'）
 * @returns {Promise<Object>} リダイレクト結果の情報
 */
export const startHostedLogin = async ({ redirectUrl = '/auth/callback' } = {}) => {
  // CSRF 対策のための state パラメータを生成
  const state = randomToken();
  // state をセッションストレージに保存（コールバック時に検証するため）
  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
    globalThis.sessionStorage.setItem(stateStorageKey, state);
  }

  // Cognito Hosted UI の認証 URL を構築
  const authorizeUrl = buildAuthorizeUrl(state);
  // 環境変数が設定されていて、ブラウザ環境の場合は実際にリダイレクト
  if (authorizeUrl && typeof globalThis?.location !== 'undefined') {
    globalThis.location.assign(authorizeUrl);
    return { performedRedirect: true, authorizeUrl, state };
  }

  // スタブ動作: Hosted UI が未設定ならローカルルーターで擬似遷移
  // 開発環境で Cognito を設定せずに動作確認するための機能
  const code = randomToken();
  const url = `${redirectUrl}?code=${code}&state=${state}`;
  return { performedRedirect: false, simulatedRedirect: url, state, code };
};

/**
 * 認証コードをトークンに交換
 * OAuth 2.0 の認証コードフローで、認証コードをアクセストークンとリフレッシュトークンに交換します
 *
 * @param {Object} params - パラメータ
 * @param {string} params.code - Cognito から返された認証コード
 * @returns {Promise<Object>} トークン情報
 */
const exchangeCodeForTokens = async ({ code }) => {
  const domain = getEnv('VITE_COGNITO_DOMAIN');
  const clientId = getEnv('VITE_COGNITO_USER_POOL_CLIENT_ID');
  const redirectUri = getRedirectUri();

  // 環境未設定時はスタブトークンを返す（開発用）
  if (!domain || !clientId) {
    return {
      accessToken: `access-${code}`,
      refreshToken: `refresh-${code}`,
    };
  }

  // OAuth 2.0 のトークンエンドポイントへのリクエストボディを構築
  const body = buildQuery({
    grant_type: 'authorization_code', // 認証コードフローを指定
    client_id: clientId,
    code, // 認証コード
    redirect_uri: redirectUri, // 認証開始時と同じリダイレクト URI（検証用）
  });

  const fetchFn = typeof globalThis !== 'undefined' ? globalThis.fetch : null;
  if (!fetchFn) {
    throw new Error('Fetch is not available in this environment');
  }

  // Cognito のトークンエンドポイントに POST リクエストを送信
  const res = await fetchFn(`https://${domain}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    const err = new Error('Token exchange failed');
    err.status = res.status;
    err.body = errorBody;
    throw err;
  }

  // レスポンスからトークン情報を取得
  const data = await res.json();
  return {
    accessToken: data.access_token, // API 呼び出しに使用するトークン
    refreshToken: data.refresh_token, // アクセストークンの有効期限切れ時に使用
    idToken: data.id_token, // ユーザー情報を含む JWT トークン
    expiresIn: data.expires_in, // アクセストークンの有効期限（秒）
    tokenType: data.token_type, // 通常は 'Bearer'
  };
};

/**
 * 認証コールバックを処理
 * Cognito Hosted UI からリダイレクトされた際に呼び出されます
 * 認証コードをトークンに交換し、ストアに保存します
 *
 * @param {Object} params - パラメータ
 * @param {string} params.code - Cognito から返された認証コード
 * @param {string} params.state - CSRF 対策の state パラメータ
 * @param {string} params.error - エラーが発生した場合のエラーコード
 * @returns {Promise<Object>} 処理結果
 */
export const handleCallback = async ({ code, state, error } = {}) => {
  // エラーパラメータが含まれている場合はエラーをスロー
  if (error) {
    const err = new Error('Authorization failed');
    err.reason = error;
    throw err;
  }
  // 認証コードが無い場合はエラー
  if (!code) {
    throw new Error('Missing authorization code');
  }

  // CSRF 対策: 保存していた state とリダイレクト時の state が一致するか確認
  const storedState =
    typeof globalThis !== 'undefined' && globalThis.sessionStorage
      ? globalThis.sessionStorage.getItem(stateStorageKey)
      : null;
  if (storedState && state && storedState !== state) {
    const err = new Error('State mismatch');
    err.reason = 'state_mismatch';
    throw err;
  }

  // 認証コードをトークンに交換
  const tokens = await exchangeCodeForTokens({ code });

  // 認証ストアとプロフィールストアを取得
  const auth = useAuthStore();
  const profile = useProfileStore();

  // トークンをストアに保存（セッションストレージにも自動保存される）
  auth.setSession(tokens);
  // TODO: API で設定完了判定に置き換え
  auth.markSetupComplete();
  // プロフィール情報を設定（現在はダミーデータ、今後は API から取得）
  profile.setProfile({
    username: 'Demo User',
    lifespan: 81,
    weekStart: 'mon',
  });

  // 使用済みの state をセッションストレージから削除
  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
    globalThis.sessionStorage.removeItem(stateStorageKey);
  }

  return { isSetupComplete: true };
};

/**
 * ログアウト処理を開始
 * セッションをクリアし、Cognito Hosted UI のログアウトページへリダイレクトします
 *
 * @returns {Object} ログアウト結果の情報
 */
export const startLogout = () => {
  const auth = useAuthStore();
  // ローカルのセッション情報をクリア
  auth.clearSession();

  // Cognito Hosted UI のログアウト URL を構築
  const logoutUrl = buildLogoutUrl();
  // 環境変数が設定されていて、ブラウザ環境の場合は実際にリダイレクト
  if (logoutUrl && typeof globalThis?.location !== 'undefined') {
    globalThis.location.assign(logoutUrl);
    return { performedRedirect: true, logoutUrl };
  }

  // スタブ動作: 環境変数が未設定の場合はフォールバック
  return { performedRedirect: false, fallbackRedirect: getLogoutRedirectUri() };
};
