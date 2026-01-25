<!--
  ルーティングプログレスコンポーネント
  ページ遷移中に表示されるローディング表示を提供します
  GlobalSpinner とは異なり、ページ遷移専用の表示です
-->
<template>
  <transition name="fade">
    <!-- isRouting が true の時のみ表示 -->
    <div
      v-if="isRouting"
      class="fixed inset-0 z-50 flex items-start justify-center bg-white/70 backdrop-blur-sm"
      aria-live="polite"
    >
      <!-- プログレスインジケーター -->
      <div
        class="mt-10 flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg"
      >
        <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-300" aria-hidden="true"></span>
        <span class="text-sm font-medium">{{ t('common.status.loading') }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../../stores/ui';

// UI ストアからルーティング状態を取得
const ui = useUiStore();
const { isRouting } = storeToRefs(ui);
const { t } = useI18n();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
