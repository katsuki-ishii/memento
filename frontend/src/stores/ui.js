import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const isRouting = ref(false);

  const startRouting = () => {
    isRouting.value = true;
  };

  const stopRouting = () => {
    isRouting.value = false;
  };

  return {
    isRouting,
    startRouting,
    stopRouting,
  };
});
