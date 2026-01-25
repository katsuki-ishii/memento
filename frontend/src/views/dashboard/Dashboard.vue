<!--
  ホームページ
  アプリケーションのメインページです
  ライフグリッドを表示します
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <!-- ヘッダー -->
      <header class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {{ t('dashboard.header.label') }}
          </p>
        </div>
      </header>

      <!-- メインコンテンツ -->
      <section class="flex justify-center">
        <!-- ライフグリッド -->
        <div
          v-if="!isLoadingProfile"
          class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
        >
          <GridCanvas @select-week="handleWeekSelect" />
          <p class="mt-3 text-xs text-gray-500">
            <span v-if="selectedWeekLabel">
              {{ t('dashboard.selection.label', { label: selectedWeekLabel }) }}
            </span>
            <span v-else>{{ t('dashboard.selection.none') }}</span>
          </p>
        </div>
        <!-- プロフィール情報読み込み中 -->
        <div v-else class="flex items-center justify-center p-8">
          <p class="text-sm text-gray-500">{{ t('common.status.loading') }}</p>
        </div>
      </section>
    </div>

    <!-- イベント編集ダイアログ -->
    <EventDialog
      :is-open="isDialogOpen"
      :is-loading="isLoadingEvents"
      :selected-week="selectedWeek"
      :event="selectedEvent"
      @close="handleDialogClose"
      @save="handleEventSave"
      @delete="handleEventDelete"
    />
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useGridStore } from '../../stores/grid';
import { useProfileStore } from '../../stores/profile';
import { useUiStore } from '../../stores/ui';
import GridCanvas from './components/GridCanvas.vue';
import EventDialog from './components/EventDialog.vue';
import { listEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventsService';
import { getSettings } from '../../services/settingsService';

// ストア
const grid = useGridStore();
const profileStore = useProfileStore();
const ui = useUiStore();
const { t } = useI18n();
const { eventsByWeek, selectedWeek } = storeToRefs(grid);

// ダイアログの状態
const isDialogOpen = ref(false);
const isLoadingEvents = ref(false);
const isLoadingProfile = ref(false);

// 選択された週のイベントを取得
const selectedEvent = computed(() => {
  if (!selectedWeek.value) return null;
  const weekId = selectedWeek.value.id;
  const events = eventsByWeek.value[weekId];
  // 複数のイベントがある場合は最初のものを返す（将来的には複数対応）
  return events && events.length > 0 ? events[0] : null;
});

const selectedWeekLabel = computed(() => {
  if (!selectedWeek.value) return null;
  return t('common.format.weekLabel', {
    year: selectedWeek.value.year,
    week: selectedWeek.value.week + 1,
  });
});

/**
 * コンポーネントがマウントされた時にプロフィール情報と全イベントを読み込む
 * 設定画面から戻ってきた場合や、直接ホームにアクセスした場合に対応
 * プロフィール情報の取得が完了してからグリッドを表示する
 */
onMounted(async () => {
  try {
    isLoadingProfile.value = true;
    // プロフィール情報がまだ読み込まれていない場合は取得
    // 常に最新の設定を取得する（ログイン直後など、ストアが空の可能性があるため）
    const settings = await getSettings();
    if (settings) {
      profileStore.setProfile(settings);
    } else if (!profileStore.profile) {
      // 設定が取得できず、ストアにもない場合はデフォルト値で進む
      // （初期設定未完了の場合はルーターガードでリダイレクトされる）
    }

    // 全イベントを取得してグリッドストアに保存
    try {
      const allEvents = await listEvents();
      // 週IDをキーとしたマップに変換
      const eventsMap = {};
      (allEvents || []).forEach((event) => {
        if (event.weekId) {
          if (!eventsMap[event.weekId]) {
            eventsMap[event.weekId] = [];
          }
          eventsMap[event.weekId].push(event);
        }
      });
      grid.setEvents(eventsMap);
    } catch (error) {
      // イベント取得エラーは無視（グリッドは表示されるが色分けされない）
      if (globalThis?.console) {
        globalThis.console.error('Events load error', error);
      }
    }
  } catch (error) {
    // エラーは無視（未設定の場合は後で初期設定画面にリダイレクトされる）
    if (globalThis?.console) {
      globalThis.console.error('Profile load error', error);
    }
  } finally {
    isLoadingProfile.value = false;
  }
});

/**
 * 週が選択された時の処理
 *
 * @param {Object} week - 選択された週のオブジェクト
 */
const handleWeekSelect = (week) => {
  grid.setSelectedWeek(week);
  isDialogOpen.value = true;
};

watch(
  () => [isDialogOpen.value, selectedWeek.value?.id],
  async ([open, weekId]) => {
    if (!open || !weekId) return;
    try {
      isLoadingEvents.value = true;
      const events = await listEvents({ weekId });
      grid.setEvents({
        ...eventsByWeek.value,
        [weekId]: events || [],
      });
    } catch (error) {
      ui.pushToast({
        title: t('toast.eventsLoadFailed'),
        message: t('errors.retryLater'),
        variant: 'error',
      });
      if (globalThis?.console) {
        globalThis.console.error('Event load error', error);
      }
    } finally {
      isLoadingEvents.value = false;
    }
  }
);

/**
 * ダイアログを閉じる
 */
const handleDialogClose = () => {
  isDialogOpen.value = false;
  grid.setSelectedWeek(null);
  isLoadingEvents.value = false;
};

/**
 * イベントを保存
 *
 * @param {Object} eventData - イベントデータ
 */
const handleEventSave = async (eventData) => {
  const weekId = eventData.weekId;
  const existingEvents = eventsByWeek.value[weekId] || [];

  try {
    if (selectedEvent.value) {
      const updated = await updateEvent(selectedEvent.value.id, eventData);
      const merged = {
        ...selectedEvent.value,
        ...eventData,
        ...(updated || {}),
      };
      const updatedEvents = existingEvents.map((e) => (e.id === merged.id ? merged : e));
      grid.setEvents({
        ...eventsByWeek.value,
        [weekId]: updatedEvents,
      });
    } else {
      const created = await createEvent(eventData);
      const newEvent = created || {
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
  } catch (error) {
    ui.pushToast({
      title: t('toast.eventsSaveFailed'),
      message: t('errors.retryLater'),
      variant: 'error',
    });
    if (globalThis?.console) {
      globalThis.console.error('Event save error', error);
    }
  }
};

/**
 * イベントを削除
 *
 * @param {string} eventId - イベントID
 */
const handleEventDelete = async (eventId) => {
  if (!selectedWeek.value) return;

  const weekId = selectedWeek.value.id;
  const existingEvents = eventsByWeek.value[weekId] || [];

  try {
    await deleteEvent(eventId);
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
  } catch (error) {
    ui.pushToast({
      title: t('toast.eventsDeleteFailed'),
      message: t('errors.retryLater'),
      variant: 'error',
    });
    if (globalThis?.console) {
      globalThis.console.error('Event delete error', error);
    }
  }
};
</script>
