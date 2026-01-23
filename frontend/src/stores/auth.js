/**
 * 認証ストア
 * ユーザーの認証状態（トークン、初期設定の完了状態など）を管理します
 * セッションストレージに永続化され、ページリロード後も状態が保持されます
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// セッションストレージに保存する際のキー名
const STORAGE_KEY = 'memento_auth';

/**
 * セッションストレージを取得
 * ブラウザ環境以外（SSR など）では null を返します
 */
const getStorage = () => (typeof globalThis !== 'undefined' ? globalThis.sessionStorage : null);

export const useAuthStore = defineStore('auth', () => {
  // 状態（リアクティブな変数）
  const accessToken = ref(null); // API 呼び出しに使用するアクセストークン
  const idToken = ref(null); // Cognito のIDトークン（API Gateway Authorizer 用）
  const refreshToken = ref(null); // アクセストークンの有効期限切れ時に使用するリフレッシュトークン
  const isSetupComplete = ref(false); // 初期設定（プロフィール設定）が完了しているか
  const hydrated = ref(false); // ストレージからの復元が完了したか（重複読み込みを防ぐ）

  // 計算プロパティ（ゲッター）
  // アクセストークンが存在すれば認証済みとみなします
  const isAuthenticated = computed(() => Boolean(idToken.value || accessToken.value));

  /**
   * セッションストレージから認証情報を復元
   * ページリロード時などに、保存されていた認証状態を読み込みます
   * 一度実行されると hydrated フラグが立つため、重複実行を防ぎます
   */
  const hydrateFromStorage = () => {
    if (hydrated.value) return;
    const storage = getStorage();
    if (!storage) {
      hydrated.value = true;
      return;
    }
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        hydrated.value = true;
        return;
      }
      // JSON 文字列をパースして状態を復元
      const parsed = JSON.parse(raw);
      accessToken.value = parsed?.accessToken ?? null;
      idToken.value = parsed?.idToken ?? null;
      refreshToken.value = parsed?.refreshToken ?? null;
      isSetupComplete.value = Boolean(parsed?.isSetupComplete);
    } catch (error) {
      // パースエラーなどが発生した場合は警告を出して続行
      if (globalThis?.console) {
        globalThis.console.warn('auth hydrate failed', error);
      }
    } finally {
      hydrated.value = true;
    }
  };

  /**
   * 現在の認証状態をセッションストレージに保存
   * ページリロード後も状態が保持されるようにします
   */
  const persist = () => {
    const storage = getStorage();
    if (!storage) return;
    const payload = {
      accessToken: accessToken.value,
      idToken: idToken.value,
      refreshToken: refreshToken.value,
      isSetupComplete: isSetupComplete.value,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  /**
   * セッション情報を設定
   * 認証成功時に呼び出され、トークンを保存します
   *
   * @param {Object} tokens - トークン情報
   * @param {string} tokens.accessToken - アクセストークン
   * @param {string} tokens.refreshToken - リフレッシュトークン
   */
  const setSession = (tokens) => {
    accessToken.value = tokens?.accessToken ?? null;
    idToken.value = tokens?.idToken ?? null;
    refreshToken.value = tokens?.refreshToken ?? null;
    persist();
  };

  /**
   * 初期設定完了をマーク
   * プロフィール設定が完了した際に呼び出されます
   */
  const markSetupComplete = () => {
    isSetupComplete.value = true;
    persist();
  };

  /**
   * セッションをクリア
   * ログアウト時に呼び出され、すべての認証情報を削除します
   */
  const clearSession = () => {
    accessToken.value = null;
    idToken.value = null;
    refreshToken.value = null;
    isSetupComplete.value = false;
    const storage = getStorage();
    if (storage) storage.removeItem(STORAGE_KEY);
  };

  return {
    // state
    accessToken,
    idToken,
    refreshToken,
    isSetupComplete,
    hydrated,
    // getters
    isAuthenticated,
    // actions
    hydrateFromStorage,
    setSession,
    markSetupComplete,
    clearSession,
  };
});
