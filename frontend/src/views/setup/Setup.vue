<!--
  初期設定ページ
  初回ログイン時にユーザーのプロフィール情報を設定するページです
  ユーザー名、生年、寿命、週開始日などを入力します
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
      <header class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">初期設定</p>
        <h1 class="text-3xl font-bold">プロフィールと寿命を入力</h1>
        <p class="text-sm text-gray-600">保存後、ホームに進みます。</p>
      </header>

      <!-- エラーメッセージ -->
      <div v-if="errors.length > 0" class="rounded-md border border-red-200 bg-red-50 p-4">
        <ul class="list-disc space-y-1 pl-5 text-sm text-red-700">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- プロフィール設定フォーム -->
      <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="handleSave">
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            ユーザー名 <span class="text-red-500">*</span>
          </span>
          <input
            v-model="form.username"
            type="text"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': errors.some((e) => e.includes('ユーザー名')) }"
            placeholder="Memento User"
            maxlength="50"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            生年 <span class="text-red-500">*</span>
          </span>
          <input
            v-model.number="form.birthYear"
            type="number"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': errors.some((e) => e.includes('生年')) }"
            placeholder="1990"
            min="1900"
            :max="currentYear"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            寿命（年） <span class="text-red-500">*</span>
          </span>
          <input
            v-model.number="form.lifespan"
            type="number"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': errors.some((e) => e.includes('寿命')) }"
            placeholder="85"
            min="1"
            max="150"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            週開始 <span class="text-red-500">*</span>
          </span>
          <select
            v-model="form.weekStart"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': errors.some((e) => e.includes('週開始')) }"
          >
            <option value="mon">月曜</option>
            <option value="sun">日曜</option>
          </select>
        </label>
        <label class="space-y-1 md:col-span-2">
          <span class="text-sm font-medium text-gray-700">テーマ</span>
          <select
            v-model="form.theme"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="light">ライト</option>
            <option value="dark">ダーク</option>
          </select>
        </label>
      </form>

      <!-- アクションボタン -->
      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="loading"
          class="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleSave"
        >
          <span v-if="loading">保存中...</span>
          <span v-else>保存してホームへ</span>
        </button>
        <RouterLink to="/" class="px-4 py-2 text-sm text-gray-600 underline underline-offset-4">
          ホームに戻る
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '../../stores/profile';
import { useAuthStore } from '../../stores/auth';
import { updateSettings } from '../../services/settingsService';

const router = useRouter();
const profileStore = useProfileStore();
const authStore = useAuthStore();

/**
 * プロフィール情報をフォーム用に正規化
 *
 * @param {Object|null} value - プロフィール情報
 * @returns {Object} 正規化済みプロフィール
 */
const normalizeProfile = (value) => ({
  username: value?.username ?? '',
  birthYear: value?.birthYear ?? null,
  lifespan: value?.lifespan ?? null,
  weekStart: value?.weekStart ?? 'mon',
  theme: value?.theme ?? 'light',
});

/**
 * プロフィールの同一性を判定
 *
 * @param {Object} left - 比較対象
 * @param {Object} right - 比較対象
 * @returns {boolean} 同一の場合 true
 */
const isSameProfile = (left, right) => {
  const a = normalizeProfile(left);
  const b = normalizeProfile(right);
  return (
    a.username === b.username &&
    a.birthYear === b.birthYear &&
    a.lifespan === b.lifespan &&
    a.weekStart === b.weekStart &&
    a.theme === b.theme
  );
};

// フォーム状態
const form = ref(normalizeProfile(profileStore.profile));

// UI状態
const loading = ref(false);
const errors = ref([]);

// 現在年を取得
const currentYear = computed(() => new Date().getFullYear());

// ストア -> フォームへの同期
watch(
  () => profileStore.profile,
  (next) => {
    if (!isSameProfile(next, form.value)) {
      form.value = normalizeProfile(next);
    }
  },
  { deep: true }
);

// フォーム -> ストアへの同期
watch(
  form,
  (next) => {
    if (!isSameProfile(next, profileStore.profile)) {
      profileStore.updateProfile(normalizeProfile(next));
    }
  },
  { deep: true }
);

/**
 * フォームのバリデーション
 *
 * @returns {boolean} バリデーション成功時 true
 */
const validateForm = () => {
  errors.value = [];

  // ユーザー名のチェック
  if (!form.value.username || form.value.username.trim().length === 0) {
    errors.value.push('ユーザー名は必須です');
  } else if (form.value.username.trim().length > 50) {
    errors.value.push('ユーザー名は50文字以内で入力してください');
  }

  // 生年のチェック
  if (!form.value.birthYear) {
    errors.value.push('生年は必須です');
  } else if (form.value.birthYear < 1900 || form.value.birthYear > currentYear.value) {
    errors.value.push(`生年は1900年から${currentYear.value}年までの範囲で入力してください`);
  }

  // 寿命のチェック
  if (!form.value.lifespan) {
    errors.value.push('寿命は必須です');
  } else if (form.value.lifespan < 1 || form.value.lifespan > 150) {
    errors.value.push('寿命は1年から150年の範囲で入力してください');
  }

  // 週開始のチェック
  if (!form.value.weekStart || !['mon', 'sun'].includes(form.value.weekStart)) {
    errors.value.push('週開始を選択してください');
  }

  return errors.value.length === 0;
};

/**
 * 保存処理
 */
const handleSave = async () => {
  // バリデーション
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  errors.value = [];

  try {
    // プロフィール情報を整形
    const profileData = {
      username: form.value.username.trim(),
      birthYear: form.value.birthYear,
      lifespan: form.value.lifespan,
      weekStart: form.value.weekStart,
      theme: form.value.theme,
    };

    await updateSettings(profileData);

    // プロフィールストアに保存
    profileStore.setProfile(profileData);

    // 認証ストアの設定完了フラグを更新
    authStore.markSetupComplete();

    // ホームへ遷移
    await router.push({ name: 'dashboard' });
  } catch (error) {
    // エラーハンドリング
    errors.value.push('保存に失敗しました。もう一度お試しください。');
    if (globalThis?.console) {
      globalThis.console.error('Setup save error', error);
    }
  } finally {
    loading.value = false;
  }
};
</script>
