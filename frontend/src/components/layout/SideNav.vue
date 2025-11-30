<template>
  <aside
    class="flex h-full w-64 flex-col border-r border-border bg-card/90 px-4 py-6 backdrop-blur"
    aria-label="サイドナビゲーション"
  >
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
        @click="$emit('logout')"
      >
        ログアウト
      </button>
    </nav>
  </aside>
</template>
