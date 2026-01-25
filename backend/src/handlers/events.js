import { createLogger } from '../lib/logger.js';
import { emptyResponse, jsonResponse, getOriginFromEvent } from '../lib/response.js';
import { getBearerToken, verifyAccessToken } from '../lib/auth.js';
import {
  createEvent,
  deleteEvent,
  listEventsByWeek,
  listAllEvents,
  updateEvent,
} from '../lib/eventsStore.js';

const MOOD_OPTIONS = new Set(['very-bad', 'bad', 'neutral', 'good', 'very-good']);

const isAuthError = (error) => {
  if (!error) return false;
  if (error.statusCode === 401) return true;
  const message = String(error.message || '');
  return message.includes('JWT') || message.includes('token') || message.includes('Unauthorized');
};

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

const normalizeWeekId = (raw) => {
  if (raw === undefined || raw === null) return null;
  const value = typeof raw === 'string' ? raw.trim() : String(raw);
  return value.length > 0 ? value : null;
};

const normalizeEvent = (item = {}) => ({
  id: item.sk,
  weekId: item.weekId,
  title: typeof item.title === 'string' ? item.title : '',
  mood: MOOD_OPTIONS.has(item.mood) ? item.mood : 'neutral',
  note: typeof item.note === 'string' ? item.note : '',
  createdAt: Number.isFinite(item.createdAt) ? item.createdAt : null,
  updatedAt: Number.isFinite(item.updatedAt) ? item.updatedAt : null,
});

const validateMood = (value) => {
  if (!MOOD_OPTIONS.has(value)) {
    const error = new Error('Invalid mood');
    error.statusCode = 400;
    throw error;
  }
};

const validateTitle = (value) => {
  if (value.length > 100) {
    const error = new Error('Title is too long');
    error.statusCode = 400;
    throw error;
  }
};

const buildCreatePayload = (body) => {
  const weekId = normalizeWeekId(body?.weekId);
  if (!weekId) {
    const error = new Error('weekId is required');
    error.statusCode = 400;
    throw error;
  }

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  validateTitle(title);

  const mood = typeof body?.mood === 'string' ? body.mood : 'neutral';
  validateMood(mood);

  const note = typeof body?.note === 'string' ? body.note.trim() : '';
  const now = Date.now();
  const id = `EVENT#${now}`;

  return {
    pk: `USER#${body.sub}`,
    sk: id,
    gsi1pk: `WEEK#${weekId}`,
    gsi1sk: `USER#${body.sub}#${id}`,
    weekId,
    title,
    mood,
    note,
    createdAt: now,
    updatedAt: now,
  };
};

const buildUpdatePayload = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    const error = new Error('Invalid request body');
    error.statusCode = 400;
    throw error;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'weekId')) {
    const error = new Error('weekId is immutable');
    error.statusCode = 400;
    throw error;
  }

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(body, 'title')) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    validateTitle(title);
    updates.title = title;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'mood')) {
    validateMood(body.mood);
    updates.mood = body.mood;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'note')) {
    const note = typeof body.note === 'string' ? body.note.trim() : '';
    updates.note = note;
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

    logger.info('events request', {
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

    const rawEventId = event.pathParameters?.id || null;
    const eventId = rawEventId ? decodeURIComponent(rawEventId) : null;

    if (!eventId) {
      if (method === 'GET') {
        const weekId = normalizeWeekId(event.queryStringParameters?.weekId);
        if (weekId) {
          // 特定週のイベントを取得
          const items = await listEventsByWeek(payload.sub, weekId);
          return jsonResponse(
            200,
            items.map((item) => normalizeEvent(item)),
            { requestOrigin }
          );
        } else {
          // weekIdがない場合は全イベントを取得
          const items = await listAllEvents(payload.sub);
          return jsonResponse(
            200,
            items.map((item) => normalizeEvent(item)),
            { requestOrigin }
          );
        }
      }

      if (method === 'POST') {
        const body = parseJsonBody(event) || {};
        const item = buildCreatePayload({ ...body, sub: payload.sub });
        const created = await createEvent(item);
        return jsonResponse(200, normalizeEvent(created), { requestOrigin });
      }
    }

    if (eventId) {
      if (method === 'PATCH') {
        const body = parseJsonBody(event) || {};
        const updates = buildUpdatePayload(body);
        const updated = await updateEvent(payload.sub, eventId, updates, Date.now());
        return jsonResponse(200, normalizeEvent(updated), { requestOrigin });
      }

      if (method === 'DELETE') {
        await deleteEvent(payload.sub, eventId);
        return emptyResponse(204, { requestOrigin });
      }
    }

    return jsonResponse(405, { message: 'Method Not Allowed' }, { requestOrigin });
  } catch (error) {
    logger.error('events request failed', {
      message: error?.message,
      stack: error?.stack,
    });

    if (isAuthError(error)) {
      return jsonResponse(401, { message: 'Unauthorized' }, { requestOrigin });
    }

    if (error?.statusCode === 400) {
      return jsonResponse(400, { message: error.message }, { requestOrigin });
    }

    if (error?.name === 'ConditionalCheckFailedException') {
      return jsonResponse(404, { message: 'Not Found' }, { requestOrigin });
    }

    return jsonResponse(500, { message: 'Internal Server Error' }, { requestOrigin });
  }
};
