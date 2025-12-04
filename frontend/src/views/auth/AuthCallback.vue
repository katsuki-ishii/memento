<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-md flex-col gap-4 px-6 py-16 text-center">
      <h1 class="text-2xl font-bold">認証処理中...</h1>
      <p class="text-sm text-gray-600">
        Cognito からのリダイレクトを処理しています。少々お待ちください。
      </p>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { handleCallback } from '../../services/authService';
import { useUiStore } from '../../stores/ui';

const route = useRoute();
const router = useRouter();
const ui = useUiStore();

onMounted(async () => {
  try {
    ui.startBusy();
    const code = Array.isArray(route.query.code) ? route.query.code[0] : route.query.code;
    const state = Array.isArray(route.query.state) ? route.query.state[0] : route.query.state;
    const error = Array.isArray(route.query.error) ? route.query.error[0] : route.query.error;

    const result = await handleCallback({ code, state, error });
    router.replace(result?.isSetupComplete ? { name: 'dashboard' } : { name: 'setup' });
    ui.pushToast({ title: 'ログインしました', variant: 'success' });
  } catch (err) {
    ui.pushToast({
      title: '認証に失敗しました',
      message: err?.reason || err?.message,
      variant: 'error',
    });
    router.replace({ name: 'auth-start' });
  } finally {
    ui.stopBusy();
  }
});
</script>
