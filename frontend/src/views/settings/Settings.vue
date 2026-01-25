<!--
  設定ページ
  ユーザーのプロフィール情報を編集するページです
  既存の設定を読み込んで編集できます
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
      <header class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {{ t('settings.header.label') }}
        </p>
        <h1 class="text-3xl font-bold">{{ t('settings.header.title') }}</h1>
        <p class="text-sm text-gray-600">{{ t('settings.header.description') }}</p>
      </header>

      <!-- エラーメッセージ -->
      <div v-if="errors.length > 0" class="rounded-md border border-red-200 bg-red-50 p-4">
        <ul class="list-disc space-y-1 pl-5 text-sm text-red-700">
          <li v-for="error in errors" :key="`${error.field}-${error.messageKey}`">
            {{ t(error.messageKey, errorValues(error)) }}
          </li>
        </ul>
      </div>

      <!-- 成功メッセージ -->
      <div
        v-if="saveSuccess"
        class="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700"
      >
        {{ t('settings.saved') }}
      </div>

      <!-- プロフィール設定フォーム -->
      <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="handleSave">
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            {{ t('common.labels.username') }} <span class="text-red-500">*</span>
          </span>
          <input
            v-model="form.username"
            type="text"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': hasFieldError('username') }"
            :placeholder="t('common.placeholders.username')"
            maxlength="50"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            {{ t('common.labels.birthYear') }} <span class="text-red-500">*</span>
          </span>
          <input
            v-model.number="form.birthYear"
            type="number"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': hasFieldError('birthYear') }"
            placeholder="1990"
            min="1900"
            :max="currentYear"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            {{ t('common.labels.lifespan') }} <span class="text-red-500">*</span>
          </span>
          <input
            v-model.number="form.lifespan"
            type="number"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': hasFieldError('lifespan') }"
            placeholder="85"
            min="1"
            max="150"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">
            {{ t('common.labels.weekStart') }} <span class="text-red-500">*</span>
          </span>
          <select
            v-model="form.weekStart"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            :class="{ 'border-red-300': hasFieldError('weekStart') }"
          >
            <option value="mon">{{ t('common.weekStart.mon') }}</option>
            <option value="sun">{{ t('common.weekStart.sun') }}</option>
          </select>
        </label>
        <label class="space-y-1 md:col-span-2">
          <span class="text-sm font-medium text-gray-700">{{ t('common.labels.theme') }}</span>
          <select
            v-model="form.theme"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="light">{{ t('common.theme.light') }}</option>
            <option value="dark">{{ t('common.theme.dark') }}</option>
          </select>
        </label>
        <label class="space-y-1 md:col-span-2">
          <span class="text-sm font-medium text-gray-700">{{ t('common.labels.language') }}</span>
          <select
            v-model="form.locale"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="ja">{{ t('common.language.ja') }}</option>
            <option value="en">{{ t('common.language.en') }}</option>
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
          <span v-if="loading">{{ t('common.status.saving') }}</span>
          <span v-else>{{ t('common.actions.save') }}</span>
        </button>
        <RouterLink
          to="/dashboard"
          class="px-4 py-2 text-sm text-gray-600 underline underline-offset-4"
        >
          {{ t('common.actions.backHome') }}
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from '../../stores/profile';
import { getSettings, updateSettings } from '../../services/settingsService';

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
const { t, locale: i18nLocale } = useI18n();

// フォーム状態
const form = ref({
  username: '',
  birthYear: null,
  lifespan: null,
  weekStart: 'mon',
  theme: 'light',
  locale: i18nLocale.value || 'en',
});

// UI状態
const loading = ref(false);
const errors = ref([]);
const saveSuccess = ref(false);

// 現在年を取得
const currentYear = computed(() => new Date().getFullYear());

/**
 * 既存のプロフィール情報をフォームに読み込む
 */
onMounted(async () => {
  try {
    loading.value = true;
    const settings = await getSettings();
    const source = settings || profile.value;
    if (settings) {
      profileStore.setProfile(settings);
    }
    if (source) {
      form.value = {
        username: source.username || '',
        birthYear: source.birthYear || null,
        lifespan: source.lifespan || null,
        weekStart: source.weekStart || 'mon',
        theme: source.theme || 'light',
        locale: source.locale || i18nLocale.value || 'en',
      };
    }
  } catch (error) {
    errors.value.push({ field: 'form', messageKey: 'settings.errors.loadFailed' });
    if (globalThis?.console) {
      globalThis.console.error('Settings load error', error);
    }
  } finally {
    loading.value = false;
  }
});

/**
 * フォームのバリデーション
 *
 * @returns {boolean} バリデーション成功時 true
 */
const validateForm = () => {
  errors.value = [];

  // ユーザー名のチェック
  if (!form.value.username || form.value.username.trim().length === 0) {
    errors.value.push({
      field: 'username',
      messageKey: 'errors.required',
      values: { fieldKey: 'common.labels.username' },
    });
  } else if (form.value.username.trim().length > 50) {
    errors.value.push({
      field: 'username',
      messageKey: 'errors.maxLength',
      values: { fieldKey: 'common.labels.username', max: 50 },
    });
  }

  // 生年のチェック
  if (!form.value.birthYear) {
    errors.value.push({
      field: 'birthYear',
      messageKey: 'errors.required',
      values: { fieldKey: 'common.labels.birthYear' },
    });
  } else if (form.value.birthYear < 1900 || form.value.birthYear > currentYear.value) {
    errors.value.push({
      field: 'birthYear',
      messageKey: 'errors.birthYearRange',
      values: { max: currentYear.value },
    });
  }

  // 寿命のチェック
  if (!form.value.lifespan) {
    errors.value.push({
      field: 'lifespan',
      messageKey: 'errors.required',
      values: { fieldKey: 'common.labels.lifespan' },
    });
  } else if (form.value.lifespan < 1 || form.value.lifespan > 150) {
    errors.value.push({
      field: 'lifespan',
      messageKey: 'errors.lifespanRange',
    });
  }

  // 週開始のチェック
  if (!form.value.weekStart || !['mon', 'sun'].includes(form.value.weekStart)) {
    errors.value.push({
      field: 'weekStart',
      messageKey: 'errors.weekStartRequired',
    });
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
  saveSuccess.value = false;

  try {
    // プロフィール情報を整形
    const profileData = {
      username: form.value.username.trim(),
      birthYear: form.value.birthYear,
      lifespan: form.value.lifespan,
      weekStart: form.value.weekStart,
      theme: form.value.theme,
      locale: form.value.locale,
    };

    const updatedProfile = await updateSettings(profileData);

    // プロフィールストアに保存
    profileStore.setProfile(updatedProfile || profileData);

    // 成功メッセージを表示
    saveSuccess.value = true;
    if (globalThis?.setTimeout) {
      globalThis.setTimeout(() => {
        saveSuccess.value = false;
      }, 3000);
    }
  } catch (error) {
    // エラーハンドリング
    errors.value.push({ field: 'form', messageKey: 'settings.errors.saveFailed' });
    if (globalThis?.console) {
      globalThis.console.error('Settings save error', error);
    }
  } finally {
    loading.value = false;
  }
};

const hasFieldError = (field) => errors.value.some((error) => error.field === field);

const errorValues = (error) => {
  const values = error?.values || {};
  const { fieldKey, ...rest } = values;
  return fieldKey ? { ...rest, field: t(fieldKey) } : rest;
};
</script>
