<!--
  ダッシュボードページ
  アプリケーションのメインページです
  ライフグリッドを表示します
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <!-- ヘッダー -->
      <header class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">ダッシュボード</p>
          <h1 class="text-3xl font-bold">ダッシュボード</h1>
        </div>
        <RouterLink to="/setup" class="text-sm text-gray-600 underline underline-offset-4"
          >設定を編集</RouterLink
        >
      </header>

      <!-- メインコンテンツ -->
      <section class="flex justify-center">
        <!-- ライフグリッド -->
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
          <GridCanvas />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import GridCanvas from './components/GridCanvas.vue';
</script>
