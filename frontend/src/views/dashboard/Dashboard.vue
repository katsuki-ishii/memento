<!--
  ダッシュボードページ
  アプリケーションのメインページです
  ライフグリッドを表示します
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <!-- ヘッダー -->
      <header class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">ダッシュボード</p>
          <h1 class="text-3xl font-bold">ダッシュボード</h1>
        </div>
      </header>

      <!-- メインコンテンツ -->
      <section class="flex justify-center">
        <!-- ライフグリッド -->
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
          <GridCanvas @select-week="handleWeekSelect" />
        </div>
      </section>
    </div>

    <!-- イベント編集ダイアログ -->
    <EventDialog
      :is-open="isDialogOpen"
      :selected-week="selectedWeek"
      :event="selectedEvent"
      @close="handleDialogClose"
      @save="handleEventSave"
      @delete="handleEventDelete"
    />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGridStore } from '../../stores/grid';
import GridCanvas from './components/GridCanvas.vue';
import EventDialog from './components/EventDialog.vue';

// グリッドストア
const grid = useGridStore();
const { eventsByWeek } = storeToRefs(grid);

// ダイアログの状態
const isDialogOpen = ref(false);
const selectedWeek = ref(null);

// 選択された週のイベントを取得
const selectedEvent = computed(() => {
  if (!selectedWeek.value) return null;
  const weekId = selectedWeek.value.id;
  const events = eventsByWeek.value[weekId];
  // 複数のイベントがある場合は最初のものを返す（将来的には複数対応）
  return events && events.length > 0 ? events[0] : null;
});

/**
 * 週が選択された時の処理
 *
 * @param {Object} week - 選択された週のオブジェクト
 */
const handleWeekSelect = (week) => {
  selectedWeek.value = week;
  isDialogOpen.value = true;
};

/**
 * ダイアログを閉じる
 */
const handleDialogClose = () => {
  isDialogOpen.value = false;
  selectedWeek.value = null;
};

/**
 * イベントを保存
 *
 * @param {Object} eventData - イベントデータ
 */
const handleEventSave = async (eventData) => {
  // TODO: API呼び出しに置き換える
  // 現在はストアに一時保存
  const weekId = eventData.weekId;
  const existingEvents = eventsByWeek.value[weekId] || [];

  if (selectedEvent.value) {
    // 更新
    const updatedEvents = existingEvents.map((e) =>
      e.id === selectedEvent.value.id ? { ...e, ...eventData } : e
    );
    grid.setEvents({
      ...eventsByWeek.value,
      [weekId]: updatedEvents,
    });
  } else {
    // 新規作成
    const newEvent = {
      id: `EVENT#${Date.now()}`,
      ...eventData,
      createdAt: Date.now(),
    };
    grid.setEvents({
      ...eventsByWeek.value,
      [weekId]: [...existingEvents, newEvent],
    });
  }

  handleDialogClose();
};

/**
 * イベントを削除
 *
 * @param {string} eventId - イベントID
 */
const handleEventDelete = async (eventId) => {
  // TODO: API呼び出しに置き換える
  if (!selectedWeek.value) return;

  const weekId = selectedWeek.value.id;
  const existingEvents = eventsByWeek.value[weekId] || [];
  const filteredEvents = existingEvents.filter((e) => e.id !== eventId);

  if (filteredEvents.length === 0) {
    // イベントがなくなったら、その週のキーを削除
    const updatedEvents = { ...eventsByWeek.value };
    delete updatedEvents[weekId];
    grid.setEvents(updatedEvents);
  } else {
    grid.setEvents({
      ...eventsByWeek.value,
      [weekId]: filteredEvents,
    });
  }

  handleDialogClose();
};
</script>
