import { createLogger } from '../lib/logger.js';
import { emptyResponse, jsonResponse } from '../lib/response.js';
import { getBearerToken, verifyAccessToken } from '../lib/auth.js';

const isAuthError = (error) => {
  if (!error) return false;
  if (error.statusCode === 401) return true;
  const message = String(error.message || '');
  return message.includes('JWT') || message.includes('token') || message.includes('Unauthorized');
};

const defaultSettings = () => ({
  username: 'Demo User',
  birthYear: 1990,
  lifespan: 81,
  weekStart: 'mon',
  theme: 'light',
});

const parseJsonBody = (event) => {
  if (!event?.body) return null;
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  try {
    return JSON.parse(raw);
  } catch {
    const err = new Error('Invalid JSON body');
    err.statusCode = 400;
    throw err;
  }
};

const resolveAuth = async (event) => {
  const claims = event?.requestContext?.authorizer?.claims;
  if (claims) {
    return { payload: claims, bypassed: false, source: 'authorizer' };
  }

  const token = getBearerToken(event.headers || {});
  const { payload, bypassed } = await verifyAccessToken(token);
  return { payload, bypassed: Boolean(bypassed), source: 'lambda' };
};

export const handler = async (event = {}) => {
  const requestId = event.requestContext?.requestId || 'unknown';
  const logger = createLogger(requestId);

  try {
    const method = event.httpMethod || 'GET';

    if (method === 'OPTIONS') {
      return emptyResponse();
    }

    const { payload, bypassed, source } = await resolveAuth(event);

    logger.info('settings request', {
      method,
      sub: payload?.sub,
      bypassed: Boolean(bypassed),
      authSource: source,
    });

    if (method === 'GET') {
      return jsonResponse(200, defaultSettings());
    }

    if (method === 'PATCH') {
      const body = parseJsonBody(event) || {};
      return jsonResponse(200, { ...defaultSettings(), ...body });
    }

    return jsonResponse(405, { message: 'Method Not Allowed' });
  } catch (error) {
    logger.error('settings request failed', {
      message: error?.message,
      stack: error?.stack,
    });

    if (isAuthError(error)) {
      return jsonResponse(401, { message: 'Unauthorized' });
    }

    return jsonResponse(500, { message: 'Internal Server Error' });
  }
};
