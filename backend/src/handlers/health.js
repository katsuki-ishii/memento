import { createLogger } from '../lib/logger.js';
import { emptyResponse, jsonResponse } from '../lib/response.js';

export const handler = async (event = {}) => {
  const requestId = event.requestContext?.requestId || 'unknown';
  const logger = createLogger(requestId);
  const method = event.httpMethod || 'GET';

  if (method === 'OPTIONS') {
    return emptyResponse();
  }

  if (method !== 'GET') {
    return jsonResponse(405, { message: 'Method Not Allowed' });
  }

  logger.info('health check', { method });
  return jsonResponse(200, { ok: true });
};
