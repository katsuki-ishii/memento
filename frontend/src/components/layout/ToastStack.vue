<!--
  トースト通知スタックコンポーネント
  画面右下に表示される通知メッセージを管理します
  成功メッセージやエラーメッセージなどを表示するために使用します
-->
<template>
  <!-- 固定位置で表示（画面右下） -->
  <!-- pointer-events-none で親要素のクリックイベントを無効化し、
       子要素（トースト）のみ pointer-events-auto で有効化 -->
  <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:right-8">
    <!-- transition-group で複数のトーストにアニメーションを適用 -->
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
          <!-- トーストの内容 -->
          <div class="space-y-1">
            <p class="text-sm font-semibold text-primary">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-muted">{{ toast.message }}</p>
          </div>
          <!-- 閉じるボタン -->
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

// UI ストアからトーストのリストを取得
// storeToRefs を使用することで、リアクティブ性を保ったまま取得できます
const ui = useUiStore();
const { toasts } = storeToRefs(ui);

/**
 * トーストを閉じる
 *
 * @param {number} id - 閉じるトーストの ID
 */
const dismiss = (id) => {
  ui.dismissToast(id);
};

/**
 * トーストのバリアント（種類）に応じた CSS クラスを返す
 *
 * @param {string} variant - バリアント（'success', 'error', 'info' など）
 * @returns {string} CSS クラス名
 */
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
