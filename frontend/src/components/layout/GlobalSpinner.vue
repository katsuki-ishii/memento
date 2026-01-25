<!--
  グローバルスピナーコンポーネント
  長時間かかる処理中に画面全体を覆うローディング表示を提供します
-->
<template>
  <transition name="fade">
    <!-- isBusy が true の時のみ表示 -->
    <div
      v-if="isBusy"
      class="fixed inset-0 z-40 grid place-items-center bg-white/70 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <!-- ローディングインジケーター -->
      <div class="flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg">
        <span class="h-2 w-2 animate-ping rounded-full bg-accent" aria-hidden="true"></span>
        <span class="text-sm font-medium">{{ t('common.status.processing') }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../../stores/ui';

// UI ストアからローディング状態を取得
const ui = useUiStore();
const { isBusy } = storeToRefs(ui);
const { t } = useI18n();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
