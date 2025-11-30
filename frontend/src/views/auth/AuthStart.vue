<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <header class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">認証</p>
        <h1 class="text-3xl font-bold">サインアップ / ログイン</h1>
        <p class="text-sm text-gray-600">Cognito Hosted UI に遷移して認証を完了します。</p>
      </header>
      <button
        class="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition hover:bg-gray-800"
        @click="start"
      >
        Hosted UI へ進む
      </button>
      <RouterLink to="/" class="text-sm text-gray-600 underline underline-offset-4"
        >ホームに戻る</RouterLink
      >
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUiStore } from '../../stores/ui';
import { startHostedLogin } from '../../services/authService';

const router = useRouter();
const ui = useUiStore();

const start = async () => {
  try {
    ui.startBusy();
    const result = await startHostedLogin({ redirectUrl: '/auth/callback' });
    // デモでは Hosted UI の代わりにルーターで callback を再現
    router.push(result.simulatedRedirect);
  } catch (error) {
    ui.pushToast({
      title: '認証を開始できませんでした',
      message: error?.message,
      variant: 'error',
    });
  } finally {
    ui.stopBusy();
  }
};
</script>
