/**
 * プロフィールストア
 * ユーザーのプロフィール情報（ユーザー名、生年、寿命、週開始日など）を管理します
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
  // 状態（リアクティブな変数）
  const profile = ref(null); // プロフィール情報オブジェクト（null の場合は未設定）
  const loading = ref(false); // プロフィール情報の読み込み中かどうか

  /**
   * プロフィール情報を設定
   *
   * @param {Object} value - プロフィール情報
   */
  const setProfile = (value) => {
    profile.value = value;
  };

  /**
   * ローディング状態を設定
   *
   * @param {boolean} value - ローディング中かどうか
   */
  const setLoading = (value) => {
    loading.value = Boolean(value);
  };

  return {
    profile,
    loading,
    setProfile,
    setLoading,
  };
});
