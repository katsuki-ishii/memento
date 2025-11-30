import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useGridStore = defineStore('grid', () => {
  const weeks = ref([]);
  const eventsByWeek = ref({});
  const loading = ref(false);

  const setWeeks = (items) => {
    weeks.value = items ?? [];
  };

  const setEvents = (map) => {
    eventsByWeek.value = map ?? {};
  };

  const setLoading = (value) => {
    loading.value = Boolean(value);
  };

  // ダミーの現在週ハイライト用
  const currentWeekId = computed(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return `${now.getFullYear()}-${week}`;
  });

  return {
    weeks,
    eventsByWeek,
    loading,
    currentWeekId,
    setWeeks,
    setEvents,
    setLoading,
  };
});
