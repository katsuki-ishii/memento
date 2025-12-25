<!--
  グリッドキャンバスコンポーネント
  ライフグリッド（週単位のグリッド）を表示します
  各週をクリックすることでイベントを表示・編集できます
-->
<template>
  <div class="space-y-4">
    <!-- 凡例（グリッドの色の意味を説明） -->
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

    <!-- グリッド本体 -->
    <!-- 年ごとにグループ化された週のリストを表示 -->
    <div class="space-y-2 max-h-[520px] overflow-y-auto pr-1">
      <div
        v-for="group in weeksByYear"
        :key="group.year"
        class="flex items-start gap-2 text-[10px]"
      >
        <!-- 年表示 -->
        <span class="w-10 shrink-0 text-right font-semibold text-muted">{{ group.year }}</span>
        <!-- 週のグリッド（1年 = 52週） -->
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

// イベント定義
const emit = defineEmits(['select-week']);

// グリッドストアからデータを取得
const grid = useGridStore();
const { weeksByYear } = storeToRefs(grid);

/**
 * コンポーネントがマウントされた時に実行
 * モックデータが存在しない場合は生成します
 */
onMounted(() => {
  grid.ensureMockData();
});

/**
 * 週の状態に応じた CSS クラスを返す
 *
 * @param {Object} week - 週のオブジェクト
 * @returns {string} CSS クラス名
 */
const weekClass = (week) => {
  if (week.isCurrent) return 'bg-accent'; // 現在の週はアクセントカラー
  if (week.hasEvent) return 'bg-primary/70'; // イベントがある週はプライマリカラー
  return 'bg-gray-200'; // それ以外はグレー
};
</script>
