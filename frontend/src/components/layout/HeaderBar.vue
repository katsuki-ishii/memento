<!--
  ヘッダーバーコンポーネント
  アプリケーションの上部に表示されるヘッダーです
  ロゴ、ナビゲーションボタン、テーマ切替ボタンを含みます
-->
<template>
  <header class="flex items-center border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
    <!-- 左側: ナビゲーションボタンとロゴ -->
    <div class="flex flex-1 items-center gap-3">
      <!-- サイドナビゲーションを開くボタン（ホームでのみ表示） -->
      <button
        v-if="showNav"
        type="button"
        class="rounded-md border border-border px-3 py-1 text-xs font-medium text-primary transition hover:border-muted"
        aria-label="サイドメニューを開閉"
        @click="emitToggleNav"
      >
        ☰
      </button>
      <!-- ロゴ（ホームへのリンク） -->
      <RouterLink to="/" class="flex items-center gap-2 text-sm font-semibold text-primary">
        <span>Memento</span>
      </RouterLink>
    </div>

    <!-- 右側: テーマ切替ボタン -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-full border border-border px-3 py-1 text-xs font-medium text-primary transition hover:border-muted"
        aria-label="テーマ切替"
        @click="toggleTheme"
      >
        {{ theme === 'dark' ? '🌙' : '☀️' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useUiStore } from '../../stores/ui';

// プロパティ定義
const props = defineProps({
  // ナビゲーションボタンを表示するかどうか
  showNav: {
    type: Boolean,
    default: false,
  },
});

// イベント定義
const emit = defineEmits(['toggle-nav']);

// UI ストアからテーマ情報を取得
const ui = useUiStore();
const theme = computed(() => ui.theme);

/**
 * テーマを切り替え
 */
const toggleTheme = () => {
  ui.toggleTheme();
};

/**
 * サイドナビゲーションの開閉を親コンポーネントに通知
 */
const emitToggleNav = () => {
  if (!props.showNav) return;
  emit('toggle-nav');
};
</script>
