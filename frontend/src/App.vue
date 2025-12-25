<!--
  アプリケーションのルートコンポーネント
  すべてのページで共通して表示されるレイアウト要素を配置します
-->
<template>
  <!-- メインのレイアウトコンテナ（ヘッダー、サイドナビなど） -->
  <AppShell>
    <!-- ルートに応じて表示されるページコンポーネント -->
    <RouterView />
  </AppShell>
  <!-- ページ遷移中のプログレス表示 -->
  <RouteProgress />
  <!-- グローバルなローディングスピナー -->
  <GlobalSpinner />
  <!-- トースト通知のスタック表示 -->
  <ToastStack />
</template>

<script setup>
import { onMounted } from 'vue';
import { useUiStore } from './stores/ui';
import AppShell from './components/layout/AppShell.vue';
import GlobalSpinner from './components/layout/GlobalSpinner.vue';
import RouteProgress from './components/layout/RouteProgress.vue';
import ToastStack from './components/layout/ToastStack.vue';

// UI 状態管理ストアを取得
const ui = useUiStore();

// コンポーネントがマウントされた時（DOM に接続された時）に実行
// ローカルストレージから保存されたテーマ設定を読み込んで適用します
onMounted(() => {
  ui.hydrateTheme();
});
</script>
