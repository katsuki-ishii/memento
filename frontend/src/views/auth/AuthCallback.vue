<!--
  認証コールバックページ
  Cognito Hosted UI からリダイレクトされた際に表示されるページです
  URL クエリパラメータから認証コードを取得し、トークンに交換してセッションを確立します
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-md flex-col gap-4 px-6 py-16 text-center">
      <h1 class="text-2xl font-bold">{{ t('login.callback.title') }}</h1>
      <p class="text-sm text-gray-600">{{ t('login.callback.description') }}</p>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { handleCallback } from '../../services/authService';
import { useUiStore } from '../../stores/ui';

const route = useRoute();
const router = useRouter();
const ui = useUiStore();
const { t } = useI18n();

/**
 * コンポーネントがマウントされた時に実行
 * URL クエリパラメータから認証情報を取得し、認証処理を実行します
 */
onMounted(async () => {
  try {
    ui.startBusy();

    // URL クエリパラメータから認証コード、state、エラーを取得
    // 配列の場合は最初の要素を取得（Vue Router の仕様）
    const code = Array.isArray(route.query.code) ? route.query.code[0] : route.query.code;
    const state = Array.isArray(route.query.state) ? route.query.state[0] : route.query.state;
    const error = Array.isArray(route.query.error) ? route.query.error[0] : route.query.error;

    // 認証コールバックを処理（認証コードをトークンに交換）
    const result = await handleCallback({ code, state, error });

    // 初期設定の完了状態に応じて、ダッシュボードまたは初期設定ページへ遷移
    router.replace(result?.isSetupComplete ? { name: 'dashboard' } : { name: 'setup' });
    ui.pushToast({ title: t('toast.loginSuccess'), variant: 'success' });
  } catch (err) {
    // エラーが発生した場合はエラーメッセージを表示して認証開始ページへ戻る
    ui.pushToast({
      title: t('toast.authFailed'),
      message: err?.reason || err?.message,
      variant: 'error',
    });
    router.replace({ name: 'auth-start' });
  } finally {
    ui.stopBusy();
  }
});
</script>
