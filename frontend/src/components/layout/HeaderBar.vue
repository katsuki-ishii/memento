<template>
  <header
    class="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur"
  >
    <RouterLink to="/" class="flex items-center gap-2 text-sm font-semibold text-primary">
      <span class="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true"></span>
      <span>Memento</span>
    </RouterLink>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-full border border-border px-3 py-1 text-xs font-medium text-primary transition hover:border-muted"
        aria-label="テーマ切替"
        @click="toggleTheme"
      >
        {{ theme === 'dark' ? '🌙' : '☀️' }}
      </button>
      <button
        v-if="showNav"
        type="button"
        class="rounded-md border border-border px-3 py-1 text-xs font-medium text-primary transition hover:border-muted md:hidden"
        aria-label="サイドメニューを開閉"
        @click="emitToggleNav"
      >
        ☰
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useUiStore } from '../../stores/ui';

const props = defineProps({
  showNav: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle-nav']);

const ui = useUiStore();
const theme = computed(() => ui.theme);

const toggleTheme = () => {
  ui.toggleTheme();
};

const emitToggleNav = () => {
  if (!props.showNav) return;
  emit('toggle-nav');
};
</script>
