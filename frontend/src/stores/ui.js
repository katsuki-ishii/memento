/**
 * UI 状態管理ストア
 * アプリケーション全体の UI 状態（テーマ、ローディング、トースト通知など）を管理します
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // 状態（リアクティブな変数）
  const isRouting = ref(false); // ページ遷移中かどうか（プログレス表示の制御に使用）
  const theme = ref('light'); // テーマ（'light' または 'dark'）
  const isBusy = ref(false); // グローバルなローディング状態（スピナー表示の制御に使用）
  const toasts = ref([]); // 表示中のトースト通知の配列
  let toastId = 0; // トースト通知に一意の ID を付与するためのカウンター

  /**
   * ローカルストレージからテーマ設定を復元
   * ページ読み込み時に、保存されていたテーマ設定を適用します
   */
  const hydrateTheme = () => {
    const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
    const doc =
      typeof globalThis !== 'undefined' && globalThis.document ? globalThis.document : null;
    if (!storage) return;
    const saved = storage.getItem('memento_theme');
    if (saved === 'light' || saved === 'dark') {
      theme.value = saved;
      // body 要素の data-theme 属性を設定（CSS でテーマを適用するため）
      if (doc?.body) doc.body.dataset.theme = saved;
    } else if (doc?.body) {
      // 保存されたテーマが無い場合はデフォルト値を適用
      doc.body.dataset.theme = theme.value;
    }
  };

  /**
   * ページ遷移開始を通知
   * ルーターの beforeEach フックから呼び出されます
   */
  const startRouting = () => {
    isRouting.value = true;
  };

  /**
   * ページ遷移完了を通知
   * ルーターの afterEach フックから呼び出されます
   */
  const stopRouting = () => {
    isRouting.value = false;
  };

  /**
   * テーマを設定
   * ローカルストレージに保存し、body 要素の data-theme 属性も更新します
   *
   * @param {string} value - テーマ名（'light' または 'dark'）
   */
  const setTheme = (value) => {
    const next = value === 'dark' ? 'dark' : 'light';
    theme.value = next;
    const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
    if (storage) storage.setItem('memento_theme', next);
    if (globalThis?.document?.body) {
      globalThis.document.body.dataset.theme = next;
    }
  };

  /**
   * テーマを切り替え
   * 現在のテーマが 'light' なら 'dark' に、'dark' なら 'light' に変更します
   */
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  };

  /**
   * グローバルローディング状態を開始
   * 長時間かかる処理の開始時に呼び出します
   */
  const startBusy = () => {
    isBusy.value = true;
  };

  /**
   * グローバルローディング状態を停止
   * 処理完了時に呼び出します
   */
  const stopBusy = () => {
    isBusy.value = false;
  };

  /**
   * トースト通知を表示
   * 成功メッセージやエラーメッセージなどを表示するために使用します
   *
   * @param {Object} options - トーストのオプション
   * @param {string} options.title - タイトル
   * @param {string} options.message - メッセージ（省略可能）
   * @param {string} options.variant - バリアント（'info', 'success', 'error' など、デフォルト: 'info'）
   * @param {number} options.duration - 表示時間（ミリ秒、0 の場合は自動で閉じない、デフォルト: 3000）
   * @returns {number} トーストの ID（手動で閉じる際に使用）
   */
  const pushToast = ({ title, message, variant = 'info', duration = 3000 }) => {
    const id = ++toastId;
    toasts.value.push({ id, title, message, variant });
    // 指定された時間が経過したら自動的に閉じる
    if (duration > 0 && typeof globalThis !== 'undefined' && globalThis.setTimeout) {
      globalThis.setTimeout(() => dismissToast(id), duration);
    }
    return id;
  };

  /**
   * トースト通知を閉じる
   *
   * @param {number} id - 閉じるトーストの ID
   */
  const dismissToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  /**
   * すべてのトースト通知をクリア
   */
  const clearToasts = () => {
    toasts.value = [];
  };

  return {
    isRouting,
    theme,
    isBusy,
    toasts,
    startRouting,
    stopRouting,
    hydrateTheme,
    setTheme,
    toggleTheme,
    startBusy,
    stopBusy,
    pushToast,
    dismissToast,
    clearToasts,
  };
});
