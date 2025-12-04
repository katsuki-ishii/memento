<template>
  <aside
    class="relative flex h-screen w-64 flex-col overflow-y-auto border-r border-border bg-card/90 px-4 py-6 backdrop-blur"
    aria-label="サイドナビゲーション"
  >
    <button
      v-if="showClose"
      type="button"
      class="absolute right-3 top-3 rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition hover:border-muted"
      aria-label="サイドメニューを閉じる"
      @click="emit('close')"
    >
      ✕
    </button>

    <p class="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">ナビゲーション</p>
    <nav class="flex flex-col gap-2 text-sm">
      <RouterLink
        to="/dashboard"
        class="rounded-md px-3 py-2 transition hover:bg-surface"
        active-class="bg-surface font-semibold"
      >
        ダッシュボード
      </RouterLink>
      <RouterLink
        to="/setup"
        class="rounded-md px-3 py-2 transition hover:bg-surface"
        active-class="bg-surface font-semibold"
      >
        設定
      </RouterLink>
      <button
        type="button"
        class="mt-4 rounded-md px-3 py-2 text-left text-danger transition hover:bg-surface"
        @click="emit('logout')"
      >
        ログアウト
      </button>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  showClose: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'logout']);
</script>
