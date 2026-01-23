/**
 * Events service
 * イベントに関する API 呼び出しをまとめます
 */

import { fetchJson } from './http/client';

/**
 * API が設定済みかどうか
 *
 * @returns {boolean} API が設定されている場合 true
 */
const hasApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return Boolean(baseUrl) && !String(baseUrl).includes('example.invalid');
};

/**
 * イベント一覧を取得
 *
 * @param {Object} params - 検索条件
 * @param {string} params.weekId - 週ID
 * @returns {Promise<Array>} イベント配列
 */
export const listEvents = async ({ weekId } = {}) => {
  if (!hasApiBaseUrl()) {
    return [];
  }
  const query = weekId ? `?weekId=${encodeURIComponent(weekId)}` : '';
  return fetchJson(`/events${query}`);
};

/**
 * イベントを作成
 *
 * @param {Object} payload - 作成するイベント
 * @returns {Promise<Object>} 作成されたイベント
 */
export const createEvent = async (payload) => {
  if (!hasApiBaseUrl()) {
    const now = Date.now();
    return {
      id: `EVENT#${now}`,
      createdAt: now,
      ...payload,
    };
  }
  return fetchJson('/events', {
    method: 'POST',
    body: JSON.stringify(payload ?? {}),
  });
};

/**
 * イベントを更新
 *
 * @param {string} eventId - イベントID
 * @param {Object} payload - 更新内容
 * @returns {Promise<Object>} 更新後のイベント
 */
export const updateEvent = async (eventId, payload) => {
  if (!eventId) {
    throw new Error('eventId is required');
  }
  if (!hasApiBaseUrl()) {
    return {
      id: eventId,
      ...payload,
    };
  }
  const updates = { ...(payload ?? {}) };
  delete updates.weekId;
  return fetchJson(`/events/${encodeURIComponent(eventId)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

/**
 * イベントを削除
 *
 * @param {string} eventId - イベントID
 * @returns {Promise<Object|null>} 削除結果
 */
export const deleteEvent = async (eventId) => {
  if (!eventId) {
    throw new Error('eventId is required');
  }
  if (!hasApiBaseUrl()) {
    return { id: eventId, deleted: true };
  }
  return fetchJson(`/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
  });
};
