<!--
  イベント編集ダイアログコンポーネント
  週に紐づくイベントの登録/編集/削除を行います
-->
<template>
  <Teleport to="body">
    <!-- オーバーレイ -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
        @click.self="handleClose"
      >
        <!-- ダイアログ -->
        <Transition name="slide-up">
          <div
            v-if="isOpen"
            class="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl"
          >
            <!-- ヘッダー -->
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  {{
                    selectedWeek
                      ? t('common.format.weekLabel', {
                          year: selectedWeek.year,
                          week: selectedWeek.week + 1,
                        })
                      : ''
                  }}
                </h2>
                <p class="mt-0.5 text-xs text-gray-500">{{ t('events.dialog.subtitle') }}</p>
              </div>
              <button
                type="button"
                class="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                @click="handleClose"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- フォーム -->
            <form class="px-6 py-4" @submit.prevent="handleSave">
              <!-- タイトル -->
              <div class="mb-4">
                <label for="title" class="mb-1.5 block text-sm font-medium text-gray-700">
                  {{ t('events.fields.title') }}
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  :placeholder="t('events.placeholders.title')"
                  maxlength="100"
                  :disabled="isLoading"
                  class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('events.meta.titleCount', { count: form.title.length }) }}
                </p>
              </div>

              <!-- 感情スコア -->
              <div class="mb-4">
                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                  {{ t('events.fields.mood') }}
                </label>
                <div class="flex gap-2">
                  <button
                    v-for="moodOption in moodOptions"
                    :key="moodOption.value"
                    type="button"
                    :class="[
                      'flex-1 rounded-md border px-3 py-2 text-sm transition',
                      form.mood === moodOption.value
                        ? 'border-gray-400 bg-gray-50 text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                    ]"
                    :disabled="isLoading"
                    @click="form.mood = moodOption.value"
                  >
                    {{ moodOption.label }}
                  </button>
                </div>
              </div>

              <!-- メモ -->
              <div class="mb-6">
                <label for="note" class="mb-1.5 block text-sm font-medium text-gray-700">
                  {{ t('events.fields.note') }}
                </label>
                <textarea
                  id="note"
                  v-model="form.note"
                  rows="4"
                  :placeholder="t('events.placeholders.note')"
                  :disabled="isLoading"
                  class="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('events.meta.noteCount', { count: form.note.length }) }}
                </p>
              </div>

              <!-- ローディング表示 -->
              <div v-if="isLoading" class="mb-4 rounded-md border border-gray-200 bg-gray-50 p-2">
                <p class="text-xs text-gray-600">{{ t('events.loading') }}</p>
              </div>

              <!-- アクションボタン -->
              <div class="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <button
                  v-if="eventId"
                  type="button"
                  class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isLoading"
                  @click="handleDelete"
                >
                  {{ t('common.actions.delete') }}
                </button>
                <div v-else></div>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isLoading"
                    @click="handleClose"
                  >
                    {{ t('common.actions.cancel') }}
                  </button>
                  <button
                    type="submit"
                    class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isLoading"
                  >
                    {{ t('common.actions.save') }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  selectedWeek: {
    type: Object,
    default: null,
  },
  event: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save', 'delete']);
const { t } = useI18n();

// フォーム状態
const form = ref({
  title: '',
  note: '',
  mood: 'neutral',
});

// イベントID（編集時）
const eventId = computed(() => props.event?.id || null);

// 感情スコアの選択肢
const moodOptions = [
  { value: 'very-bad', label: '😢' },
  { value: 'bad', label: '😞' },
  { value: 'neutral', label: '😐' },
  { value: 'good', label: '😊' },
  { value: 'very-good', label: '😄' },
];

// イベントが変更されたらフォームを更新
watch(
  () => props.event,
  (newEvent) => {
    if (newEvent) {
      form.value = {
        title: newEvent.title || '',
        note: newEvent.note || '',
        mood: newEvent.mood || 'neutral',
      };
    } else {
      form.value = {
        title: '',
        note: '',
        mood: 'neutral',
      };
    }
  },
  { immediate: true }
);

// ダイアログが閉じられたらフォームをリセット
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      form.value = {
        title: '',
        note: '',
        mood: 'neutral',
      };
    }
  }
);

/**
 * ダイアログを閉じる
 */
const handleClose = () => {
  emit('close');
};

/**
 * 保存処理
 */
const handleSave = () => {
  if (!props.selectedWeek || props.isLoading) return;

  emit('save', {
    weekId: props.selectedWeek.id,
    title: form.value.title.trim(),
    note: form.value.note.trim(),
    mood: form.value.mood,
  });
};

/**
 * 削除処理
 */
const handleDelete = () => {
  if (!eventId.value || props.isLoading) return;

  if (globalThis?.confirm?.(t('events.confirmDelete'))) {
    emit('delete', eventId.value);
  }
};
</script>

<style scoped>
/* フェードインアニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* スライドアップアニメーション */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
