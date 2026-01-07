/**
 * Settings service
 * ユーザー設定に関する API 呼び出しをまとめます
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
 * 設定を取得
 *
 * @returns {Promise<Object|null>} 設定情報
 */
export const getSettings = async () => {
  if (!hasApiBaseUrl()) {
    return null;
  }
  return fetchJson('/me/settings');
};

/**
 * 設定を更新
 *
 * @param {Object} payload - 更新する設定
 * @returns {Promise<Object>} 更新後の設定
 */
export const updateSettings = async (payload) => {
  if (!hasApiBaseUrl()) {
    return { ...payload };
  }
  return fetchJson('/me/settings', {
    method: 'PATCH',
    body: JSON.stringify(payload ?? {}),
  });
};
