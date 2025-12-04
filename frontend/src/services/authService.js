import { useAuthStore } from '../stores/auth';
import { useProfileStore } from '../stores/profile';

const randomToken = () => Math.random().toString(36).slice(2);

const getEnv = (key) => import.meta.env[key];

const getRedirectUri = () => {
  const configured = getEnv('VITE_COGNITO_REDIRECT_URI');
  if (configured) return configured;
  const origin =
    typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.origin : '';
  return origin ? `${origin}/auth/callback` : '/auth/callback';
};

const getLogoutRedirectUri = () => {
  const configured = getEnv('VITE_COGNITO_LOGOUT_REDIRECT_URI');
  if (configured) return configured;
  const origin =
    typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.origin : '';
  return origin ? `${origin}/auth/start` : '/auth/start';
};

const stateStorageKey = 'memento_oauth_state';

const buildQuery = (params) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

const buildAuthorizeUrl = (state) => {
  const domain = getEnv('VITE_COGNITO_DOMAIN');
  const clientId = getEnv('VITE_COGNITO_USER_POOL_CLIENT_ID');
  if (!domain || !clientId) return null;

  const redirectUri = getRedirectUri();
  const scope = getEnv('VITE_COGNITO_SCOPE') || 'openid email profile offline_access';
  const search = buildQuery({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope,
  });
  return `https://${domain}/oauth2/authorize?${search}`;
};

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
 * Hosted UI への遷移（環境変数が揃っていれば本番リダイレクト、無ければスタブ遷移）
 */
export const startHostedLogin = async ({ redirectUrl = '/auth/callback' } = {}) => {
  const state = randomToken();
  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
    globalThis.sessionStorage.setItem(stateStorageKey, state);
  }

  const authorizeUrl = buildAuthorizeUrl(state);
  if (authorizeUrl && typeof globalThis?.location !== 'undefined') {
    globalThis.location.assign(authorizeUrl);
    return { performedRedirect: true, authorizeUrl, state };
  }

  // スタブ動作: Hosted UI が未設定ならローカルルーターで擬似遷移
  const code = randomToken();
  const url = `${redirectUrl}?code=${code}&state=${state}`;
  return { performedRedirect: false, simulatedRedirect: url, state, code };
};

const exchangeCodeForTokens = async ({ code }) => {
  const domain = getEnv('VITE_COGNITO_DOMAIN');
  const clientId = getEnv('VITE_COGNITO_USER_POOL_CLIENT_ID');
  const redirectUri = getRedirectUri();

  // 環境未設定時はスタブトークンを返す
  if (!domain || !clientId) {
    return {
      accessToken: `access-${code}`,
      refreshToken: `refresh-${code}`,
    };
  }

  const body = buildQuery({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  });

  const fetchFn = typeof globalThis !== 'undefined' ? globalThis.fetch : null;
  if (!fetchFn) {
    throw new Error('Fetch is not available in this environment');
  }

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

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
};

/**
 * Hosted UI からの戻りを処理
 */
export const handleCallback = async ({ code, state, error } = {}) => {
  if (error) {
    const err = new Error('Authorization failed');
    err.reason = error;
    throw err;
  }
  if (!code) {
    throw new Error('Missing authorization code');
  }

  const storedState =
    typeof globalThis !== 'undefined' && globalThis.sessionStorage
      ? globalThis.sessionStorage.getItem(stateStorageKey)
      : null;
  if (storedState && state && storedState !== state) {
    const err = new Error('State mismatch');
    err.reason = 'state_mismatch';
    throw err;
  }

  const tokens = await exchangeCodeForTokens({ code });

  const auth = useAuthStore();
  const profile = useProfileStore();

  auth.setSession(tokens);
  auth.markSetupComplete(); // TODO: API で設定完了判定に置き換え
  profile.setProfile({
    username: 'Demo User',
    lifespan: 81,
    weekStart: 'mon',
  });

  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
    globalThis.sessionStorage.removeItem(stateStorageKey);
  }

  return { isSetupComplete: true };
};

export const startLogout = () => {
  const auth = useAuthStore();
  auth.clearSession();

  const logoutUrl = buildLogoutUrl();
  if (logoutUrl && typeof globalThis?.location !== 'undefined') {
    globalThis.location.assign(logoutUrl);
    return { performedRedirect: true, logoutUrl };
  }

  return { performedRedirect: false, fallbackRedirect: getLogoutRedirectUri() };
};
