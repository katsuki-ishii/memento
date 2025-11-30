<template>
  <transition name="fade">
    <div
      v-if="isBusy"
      class="fixed inset-0 z-40 grid place-items-center bg-white/70 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg">
        <span class="h-2 w-2 animate-ping rounded-full bg-accent" aria-hidden="true"></span>
        <span class="text-sm font-medium">処理中です...</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUiStore } from '../../stores/ui';

const ui = useUiStore();
const { isBusy } = storeToRefs(ui);
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
