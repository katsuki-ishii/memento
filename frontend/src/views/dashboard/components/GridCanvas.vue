<!--
  グリッドキャンバスコンポーネント
  ライフグリッド（週単位のグリッド）を表示します
  過去（使った時間）、現在週、未来（残りの時間）を色分けして時間の有限性を可視化します
-->
<template>
  <div class="space-y-4">
    <!-- 凡例（グリッドの色の意味を説明） -->
    <div class="flex flex-wrap items-center gap-3 text-xs text-muted">
      <span class="inline-flex items-center gap-1">
        <span class="h-4 w-4 rounded-sm bg-gray-200"></span> 過去（使った時間）
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="h-4 w-4 rounded-sm bg-accent"></span> 今週
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="h-4 w-4 rounded-sm bg-gray-100"></span> 未来（残りの時間）
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="h-4 w-4 rounded-sm bg-green-400"></span>
        緑は記録したイベントの感情スコアを表します
      </span>
    </div>

    <!-- グリッド本体 -->
    <!-- 年ごとにグループ化された週のリストを表示 -->
    <div class="space-y-1.5">
      <div v-for="group in weeksByYear" :key="group.year" class="flex items-center gap-3 text-xs">
        <!-- 年表示 -->
        <span class="w-12 shrink-0 text-right font-semibold text-muted">{{ group.year }}</span>
        <!-- 週のグリッド（1年 = 52週、4週ごとにグループ化） -->
        <div class="flex gap-1">
          <div
            v-for="(chunk, chunkIndex) in chunkWeeks(group.weeks, 4)"
            :key="chunkIndex"
            class="flex gap-0.5"
          >
            <button
              v-for="week in chunk"
              :key="week.id"
              type="button"
              class="h-4 w-4 rounded-sm transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
              :class="weekClass(week)"
              :title="`${week.year}年 第${week.week + 1}週`"
              @click="emit('select-week', week)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGridStore } from '../../../stores/grid';
import { useProfileStore } from '../../../stores/profile';

// イベント定義
const emit = defineEmits(['select-week']);

// ストアからデータを取得
const grid = useGridStore();
const profileStore = useProfileStore();
const { weeksByYear, currentWeekId, eventsByWeek } = storeToRefs(grid);
const { profile } = storeToRefs(profileStore);

/**
 * プロフィール情報に基づいてグリッドを生成/再生成
 */
const generateGrid = () => {
  // プロフィール情報が利用可能な場合はそれを使用、なければデフォルト値
  if (profile.value?.birthYear && profile.value?.lifespan) {
    grid.ensureMockData(profile.value);
  } else {
    // プロフィール情報がまだない場合はデフォルト値で生成
    grid.ensureMockData();
  }
};

/**
 * コンポーネントがマウントされた時に実行
 * モックデータが存在しない場合は生成します
 */
onMounted(() => {
  generateGrid();
});

/**
 * プロフィール情報が変更されたときにグリッドを再生成
 * 設定保存後にグリッドが更新されるようにする
 */
watch(
  () => [profile.value?.birthYear, profile.value?.lifespan],
  () => {
    generateGrid();
  },
  { deep: true }
);

/**
 * 配列を指定サイズのチャンクに分割
 *
 * @param {Array} array - 分割する配列
 * @param {number} size - チャンクサイズ
 * @returns {Array} チャンクの配列
 */
const chunkWeeks = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * 感情スコアに応じた色のマッピング
 */
const moodColorMap = {
  'very-good': 'bg-green-600',
  good: 'bg-green-400',
  neutral: 'bg-green-300',
  bad: 'bg-green-200',
  'very-bad': 'bg-green-100',
};

/**
 * 週の状態に応じた CSS クラスを返す
 * 過去（使った時間）、現在週、未来（残りの時間）を色分け
 * イベントがある場合は感情スコアに応じた色を返す
 *
 * @param {Object} week - 週のオブジェクト
 * @returns {string} CSS クラス名
 */
const weekClass = (week) => {
  const currentId = currentWeekId.value;

  // 現在の週はアクセントカラー（イベントの有無に関わらず）
  if (week.isCurrent || week.id === currentId) {
    return 'bg-accent';
  }

  // その週のイベントを取得
  const weekEvents = eventsByWeek.value[week.id];
  const event = weekEvents && weekEvents.length > 0 ? weekEvents[0] : null;

  // イベントがある場合は感情スコアに応じた色を返す
  if (event && event.mood && moodColorMap[event.mood]) {
    return moodColorMap[event.mood];
  }

  // イベントがない場合の処理
  // 過去と未来を比較
  // 週IDは "YYYY-WXX" 形式なので、文字列比較で過去/未来を判定
  if (week.id < currentId) {
    // 過去（使った時間）: 薄いグレー
    return 'bg-gray-200';
  }

  // 未来（残りの時間）: さらに薄いグレー
  return 'bg-gray-100';
};
</script>
