<template>
  <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:right-8">
    <transition-group name="toast" tag="div" class="flex flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="status"
        aria-live="polite"
        :class="[
          'pointer-events-auto w-72 rounded-lg border bg-card px-4 py-3 shadow-lg ring-1 ring-black/5',
          variantClass(toast.variant),
        ]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm font-semibold text-primary">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-muted">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="text-xs text-muted transition hover:text-primary"
            aria-label="トーストを閉じる"
            @click="dismiss(toast.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUiStore } from '../../stores/ui';

const ui = useUiStore();
const { toasts } = storeToRefs(ui);

const dismiss = (id) => {
  ui.dismissToast(id);
};

const variantClass = (variant) => {
  switch (variant) {
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'error':
      return 'border-danger bg-danger/10 text-danger-foreground';
    default:
      return '';
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
