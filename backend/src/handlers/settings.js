import { createLogger } from '../lib/logger.js';
import { emptyResponse, jsonResponse, getOriginFromEvent } from '../lib/response.js';
import { getBearerToken, verifyAccessToken } from '../lib/auth.js';
import { getSettingsItem, updateSettingsItem } from '../lib/settingsStore.js';

const isAuthError = (error) => {
  if (!error) return false;
  if (error.statusCode === 401) return true;
  const message = String(error.message || '');
  return message.includes('JWT') || message.includes('token') || message.includes('Unauthorized');
};

const WEEK_START_OPTIONS = new Set(['mon', 'sun']);
const THEME_OPTIONS = new Set(['light', 'dark']);
const LOCALE_OPTIONS = new Set(['ja', 'en']);

const defaultSettings = () => ({
  username: '',
  birthYear: 1990,
  lifespan: 81,
  weekStart: 'mon',
  theme: 'light',
  locale: null,
  createdAt: null,
  updatedAt: null,
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

const normalizeSettings = (item = {}) => {
  const defaults = defaultSettings();
  return {
    username: typeof item.username === 'string' ? item.username : defaults.username,
    birthYear: Number.isFinite(item.birthYear) ? item.birthYear : defaults.birthYear,
    lifespan: Number.isFinite(item.lifespan) ? item.lifespan : defaults.lifespan,
    weekStart: WEEK_START_OPTIONS.has(item.weekStart) ? item.weekStart : defaults.weekStart,
    theme: THEME_OPTIONS.has(item.theme) ? item.theme : defaults.theme,
    locale: LOCALE_OPTIONS.has(item.locale) ? item.locale : defaults.locale,
    createdAt: Number.isFinite(item.createdAt) ? item.createdAt : defaults.createdAt,
    updatedAt: Number.isFinite(item.updatedAt) ? item.updatedAt : defaults.updatedAt,
  };
};

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const validateAndBuildUpdates = (payload) => {
  if (!isPlainObject(payload)) {
    const error = new Error('Invalid request body');
    error.statusCode = 400;
    throw error;
  }

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(payload, 'username')) {
    const username = String(payload.username || '').trim();
    if (!username || username.length > 50) {
      const error = new Error('Invalid username');
      error.statusCode = 400;
      throw error;
    }
    updates.username = username;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'birthYear')) {
    const birthYear = Number(payload.birthYear);
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear) {
      const error = new Error('Invalid birthYear');
      error.statusCode = 400;
      throw error;
    }
    updates.birthYear = birthYear;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'lifespan')) {
    const lifespan = Number(payload.lifespan);
    if (!Number.isInteger(lifespan) || lifespan < 1 || lifespan > 150) {
      const error = new Error('Invalid lifespan');
      error.statusCode = 400;
      throw error;
    }
    updates.lifespan = lifespan;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'weekStart')) {
    if (!WEEK_START_OPTIONS.has(payload.weekStart)) {
      const error = new Error('Invalid weekStart');
      error.statusCode = 400;
      throw error;
    }
    updates.weekStart = payload.weekStart;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'theme')) {
    if (!THEME_OPTIONS.has(payload.theme)) {
      const error = new Error('Invalid theme');
      error.statusCode = 400;
      throw error;
    }
    updates.theme = payload.theme;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'locale')) {
    if (!LOCALE_OPTIONS.has(payload.locale)) {
      const error = new Error('Invalid locale');
      error.statusCode = 400;
      throw error;
    }
    updates.locale = payload.locale;
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error('No updatable fields');
    error.statusCode = 400;
    throw error;
  }

  return updates;
};

export const handler = async (event = {}) => {
  const requestId = event.requestContext?.requestId || 'unknown';
  const logger = createLogger(requestId);
  const requestOrigin = getOriginFromEvent(event);

  try {
    const method = event.httpMethod || 'GET';

    if (method === 'OPTIONS') {
      return emptyResponse(204, { requestOrigin });
    }

    const { payload, bypassed, source } = await resolveAuth(event);

    logger.info('settings request', {
      method,
      sub: payload?.sub,
      bypassed: Boolean(bypassed),
      authSource: source,
    });

    if (!payload?.sub) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }

    if (method === 'GET') {
      const item = await getSettingsItem(payload?.sub);
      return jsonResponse(200, normalizeSettings(item), { requestOrigin });
    }

    if (method === 'PATCH') {
      const body = parseJsonBody(event) || {};
      const updates = validateAndBuildUpdates(body);
      const now = Date.now();
      const updated = await updateSettingsItem(payload?.sub, updates, now);
      return jsonResponse(200, normalizeSettings(updated), { requestOrigin });
    }

    return jsonResponse(405, { message: 'Method Not Allowed' }, { requestOrigin });
  } catch (error) {
    logger.error('settings request failed', {
      message: error?.message,
      stack: error?.stack,
    });

    if (isAuthError(error)) {
      return jsonResponse(401, { message: 'Unauthorized' }, { requestOrigin });
    }

    return jsonResponse(500, { message: 'Internal Server Error' }, { requestOrigin });
  }
};
