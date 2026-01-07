import { createLogger } from '../lib/logger.js';
import { emptyResponse, jsonResponse } from '../lib/response.js';
import { getBearerToken, verifyAccessToken } from '../lib/auth.js';

const isAuthError = (error) => {
  if (!error) return false;
  if (error.statusCode === 401) return true;
  const message = String(error.message || '');
  return message.includes('JWT') || message.includes('token') || message.includes('Unauthorized');
};

export const handler = async (event = {}) => {
  const requestId = event.requestContext?.requestId || 'unknown';
  const logger = createLogger(requestId);

  try {
    const method = event.httpMethod || 'GET';

    if (method === 'OPTIONS') {
      return emptyResponse();
    }

    const token = getBearerToken(event.headers || {});
    const { payload, bypassed } = await verifyAccessToken(token);

    logger.info('request', {
      method,
      path: event.path,
      sub: payload?.sub,
      bypassed: Boolean(bypassed),
    });

    if (event.path === '/health') {
      return jsonResponse(200, { ok: true });
    }

    return jsonResponse(404, { message: 'Not Found' });
  } catch (error) {
    logger.error('request failed', {
      message: error?.message,
      stack: error?.stack,
    });

    if (isAuthError(error)) {
      return jsonResponse(401, { message: 'Unauthorized' });
    }

    return jsonResponse(500, { message: 'Internal Server Error' });
  }
};
