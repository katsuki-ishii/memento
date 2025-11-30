<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <header class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">ダッシュボード</p>
          <h1 class="text-3xl font-bold">ライフグリッド</h1>
          <p class="text-sm text-gray-600">現在週のハイライトと記録済みイベントを確認できます。</p>
        </div>
        <RouterLink to="/setup" class="text-sm text-gray-600 underline underline-offset-4"
          >設定を編集</RouterLink
        >
      </header>

      <section class="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
          <p class="mb-3 text-sm font-semibold text-gray-600">グリッド（プレースホルダ）</p>
          <GridCanvas />
        </div>
        <div class="space-y-4">
          <SummaryPanel />
          <EventDrawer />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import GridCanvas from './components/GridCanvas.vue';
import SummaryPanel from './components/SummaryPanel.vue';
import EventDrawer from './components/EventDrawer.vue';
</script>
