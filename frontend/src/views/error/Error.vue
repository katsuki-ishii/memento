<!--
  エラーページ
  アプリケーションでエラーが発生した際に表示されるページです
  ルーターガードでエラーが発生した場合などに表示されます
-->
<template>
  <main class="grid min-h-screen place-items-center bg-white px-6 py-16 text-gray-900">
    <div class="max-w-md space-y-4 text-center">
      <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {{ t('errorPage.label') }}
      </p>
      <h1 class="text-3xl font-bold">{{ t('errorPage.title') }}</h1>
      <p class="text-sm text-gray-600">{{ t('errorPage.description') }}</p>
      <!-- ナビゲーションリンク -->
      <div class="flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          to="/dashboard"
          class="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition hover:bg-gray-800"
        >
          {{ t('errorPage.actions.backDashboard') }}
        </RouterLink>
        <RouterLink
          to="/"
          class="rounded-md border border-gray-300 px-4 py-2 text-gray-900 transition hover:border-gray-400"
        >
          {{ t('errorPage.actions.backLanding') }}
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
