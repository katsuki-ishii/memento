<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3 text-xs text-muted">
      <span class="inline-flex items-center gap-1">
        <span class="h-3 w-3 rounded-sm bg-gray-200"></span> 未記録
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="h-3 w-3 rounded-sm bg-primary/70"></span> イベントあり
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="h-3 w-3 rounded-sm bg-accent"></span> 今週
      </span>
    </div>

    <div class="space-y-2 max-h-[520px] overflow-y-auto pr-1">
      <div
        v-for="group in weeksByYear"
        :key="group.year"
        class="flex items-start gap-2 text-[10px]"
      >
        <span class="w-10 shrink-0 text-right font-semibold text-muted">{{ group.year }}</span>
        <div class="grid gap-[3px]" :style="{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }">
          <button
            v-for="week in group.weeks"
            :key="week.id"
            type="button"
            class="h-4 w-4 rounded-sm transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
            :class="weekClass(week)"
            :title="`${week.year}年 第${week.week + 1}週`"
            @click="emit('select-week', week)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useGridStore } from '../../../stores/grid';

const emit = defineEmits(['select-week']);

const grid = useGridStore();
const { weeksByYear } = storeToRefs(grid);

onMounted(() => {
  grid.ensureMockData();
});

const weekClass = (week) => {
  if (week.isCurrent) return 'bg-accent';
  if (week.hasEvent) return 'bg-primary/70';
  return 'bg-gray-200';
};
</script>
