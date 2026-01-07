const getCorsOrigin = () => process.env.CORS_ALLOW_ORIGIN || '*';

const baseHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': getCorsOrigin(),
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
});

const jsonResponse = (statusCode, payload, headers = {}) => ({
  statusCode,
  headers: { ...baseHeaders(), ...headers },
  body: payload === undefined ? '' : JSON.stringify(payload),
});

const emptyResponse = (statusCode = 204, headers = {}) => ({
  statusCode,
  headers: { ...baseHeaders(), ...headers },
  body: '',
});

export { jsonResponse, emptyResponse };
