import { createLogger } from '../lib/logger.js';
import { emptyResponse, jsonResponse, getOriginFromEvent } from '../lib/response.js';

export const handler = async (event = {}) => {
  const requestId = event.requestContext?.requestId || 'unknown';
  const logger = createLogger(requestId);
  const method = event.httpMethod || 'GET';
  const requestOrigin = getOriginFromEvent(event);

  if (method === 'OPTIONS') {
    return emptyResponse(204, { requestOrigin });
  }

  if (method !== 'GET') {
    return jsonResponse(405, { message: 'Method Not Allowed' }, { requestOrigin });
  }

  logger.info('health check', { method });
  return jsonResponse(200, { ok: true }, { requestOrigin });
};
