/**
 * 許可されたオリジンのリストを取得
 * CORS_ALLOW_ORIGIN環境変数はカンマ区切りで複数のオリジンを指定可能
 */
const getAllowedOrigins = () => {
  const origins = process.env.CORS_ALLOW_ORIGIN || '*';
  if (origins === '*') return ['*'];
  return origins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

/**
 * リクエストのOriginヘッダーに基づいてCORSオリジンを決定
 * @param {string|undefined} requestOrigin - リクエストのOriginヘッダー
 */
const getCorsOrigin = (requestOrigin) => {
  const allowed = getAllowedOrigins();
  if (allowed.includes('*')) return '*';
  if (requestOrigin && allowed.includes(requestOrigin)) return requestOrigin;
  // フォールバック: 最初の許可されたオリジンを返す
  return allowed[0] || '*';
};

const baseHeaders = (requestOrigin) => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': getCorsOrigin(requestOrigin),
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
});

const jsonResponse = (statusCode, payload, options = {}) => {
  const { headers = {}, requestOrigin } = options;
  return {
    statusCode,
    headers: { ...baseHeaders(requestOrigin), ...headers },
    body: payload === undefined ? '' : JSON.stringify(payload),
  };
};

const emptyResponse = (statusCode = 204, options = {}) => {
  const { headers = {}, requestOrigin } = options;
  return {
    statusCode,
    headers: { ...baseHeaders(requestOrigin), ...headers },
    body: '',
  };
};

/**
 * Lambda イベントから Origin ヘッダーを取得
 * @param {Object} event - Lambda イベントオブジェクト
 */
const getOriginFromEvent = (event) => {
  const headers = event?.headers || {};
  return headers.origin || headers.Origin || null;
};

export { jsonResponse, emptyResponse, getOriginFromEvent };
