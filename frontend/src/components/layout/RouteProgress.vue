<template>
  <transition name="fade">
    <div
      v-if="isRouting"
      class="fixed inset-0 z-50 flex items-start justify-center bg-white/70 backdrop-blur-sm"
      aria-live="polite"
    >
      <div
        class="mt-10 flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg"
      >
        <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-300" aria-hidden="true"></span>
        <span class="text-sm font-medium">ページを読み込み中...</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUiStore } from '../../stores/ui';

const ui = useUiStore();
const { isRouting } = storeToRefs(ui);
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
