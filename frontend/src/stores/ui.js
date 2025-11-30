import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const isRouting = ref(false);
  const theme = ref('light');

  const hydrateTheme = () => {
    const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
    const doc =
      typeof globalThis !== 'undefined' && globalThis.document ? globalThis.document : null;
    if (!storage) return;
    const saved = storage.getItem('memento_theme');
    if (saved === 'light' || saved === 'dark') {
      theme.value = saved;
      if (doc?.body) doc.body.dataset.theme = saved;
    } else if (doc?.body) {
      doc.body.dataset.theme = theme.value;
    }
  };

  const startRouting = () => {
    isRouting.value = true;
  };

  const stopRouting = () => {
    isRouting.value = false;
  };

  const setTheme = (value) => {
    const next = value === 'dark' ? 'dark' : 'light';
    theme.value = next;
    const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
    if (storage) storage.setItem('memento_theme', next);
    if (globalThis?.document?.body) {
      globalThis.document.body.dataset.theme = next;
    }
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  };

  return {
    isRouting,
    theme,
    startRouting,
    stopRouting,
    hydrateTheme,
    setTheme,
    toggleTheme,
  };
});
