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
    return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
  });

  const weeksByYear = computed(() => {
    const groups = [];
    let currentYear = null;
    let bucket = [];
    weeks.value.forEach((w) => {
      if (currentYear !== w.year) {
        if (bucket.length) groups.push({ year: currentYear, weeks: bucket });
        currentYear = w.year;
        bucket = [];
      }
      bucket.push(w);
    });
    if (bucket.length) groups.push({ year: currentYear, weeks: bucket });
    return groups;
  });

  const generateMockWeeks = (lifespan = 81, startYear = 1990) => {
    const current = currentWeekId.value;
    const list = [];
    for (let y = 0; y < lifespan; y += 1) {
      const year = startYear + y;
      for (let w = 0; w < 52; w += 1) {
        const id = `${year}-W${String(w).padStart(2, '0')}`;
        list.push({
          id,
          year,
          week: w,
          hasEvent: w % 10 === 0, // デモ用ダミー
          isCurrent: id === current,
        });
      }
    }
    return list;
  };

  const ensureMockData = () => {
    if (weeks.value.length) return;
    setWeeks(generateMockWeeks());
  };

  return {
    weeks,
    eventsByWeek,
    loading,
    currentWeekId,
    weeksByYear,
    setWeeks,
    setEvents,
    setLoading,
    ensureMockData,
  };
});
