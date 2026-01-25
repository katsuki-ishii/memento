<!--
  認証開始ページ
  ユーザーが認証フローを開始するページです
  Cognito Hosted UI へのリダイレクトを行います
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <header class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {{ t('login.header.label') }}
        </p>
        <h1 class="text-3xl font-bold">{{ t('login.title') }}</h1>
      </header>
      <!-- 認証開始ボタン -->
      <button
        class="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition hover:bg-gray-800"
        @click="start"
      >
        {{ t('login.action') }}
      </button>
      <RouterLink to="/" class="text-sm text-gray-600 underline underline-offset-4">{{
        t('login.backHome')
      }}</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../../stores/ui';
import { startHostedLogin } from '../../services/authService';

const router = useRouter();
const ui = useUiStore();
const { t } = useI18n();

/**
 * 認証フローを開始
 * Cognito Hosted UI へのリダイレクトを行います
 * 環境変数が設定されていない場合は、開発用のスタブ動作（擬似リダイレクト）を行います
 */
const start = async () => {
  try {
    // ローディング状態を開始
    ui.startBusy();
    // 認証サービスを呼び出して認証フローを開始
    const result = await startHostedLogin({ redirectUrl: '/auth/callback' });

    // 実際にリダイレクトが行われた場合は、ここで処理を終了
    // （ブラウザが Cognito Hosted UI に遷移するため）
    if (result?.performedRedirect) {
      return;
    }

    // Hosted UI 未設定の場合はローカルルーターで擬似遷移
    // 開発環境で Cognito を設定せずに動作確認するための機能
    if (result?.simulatedRedirect) {
      router.push(result.simulatedRedirect);
    } else {
      throw new Error('Hosted UI is not configured (VITE_COGNITO_* envs missing)');
    }
  } catch (error) {
    // エラーが発生した場合はトースト通知で表示
    ui.pushToast({
      title: t('toast.authStartFailed'),
      message: error?.message,
      variant: 'error',
    });
  } finally {
    // ローディング状態を停止
    ui.stopBusy();
  }
};
</script>
