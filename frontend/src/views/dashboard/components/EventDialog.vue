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
                      'mood-button flex-1 rounded-md border px-3 py-2 text-sm transition',
                      `mood-${moodOption.value}`,
                      form.mood === moodOption.value
                        ? 'border-gray-400 bg-gray-50 text-gray-900 mood-selected'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                    ]"
                    :disabled="isLoading"
                    @click="form.mood = moodOption.value"
                  >
                    <span class="mood-emoji relative inline-block">{{ moodOption.label }}</span>
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

/* ムードボタンのアニメーション */
.mood-button {
  position: relative;
  overflow: visible;
}

.mood-emoji {
  display: inline-block;
  font-size: 1.25rem;
  line-height: 1;
  transition: transform 0.2s ease;
}

/* ホバー時の拡大アニメーション */
.mood-button:hover:not(:disabled) .mood-emoji {
  transform: scale(1.2);
}

/* 選択時のアニメーション */
.mood-selected .mood-emoji {
  animation: moodPulse 0.4s ease;
}

/* 😢 very-bad: 涙が流れるアニメーション */
.mood-very-bad .mood-emoji::before,
.mood-very-bad .mood-emoji::after {
  content: '💧';
  position: absolute;
  font-size: 0.5rem;
  opacity: 0;
}

.mood-very-bad .mood-emoji::before {
  left: 20%;
  top: 10%;
  animation-delay: 0s;
}

.mood-very-bad .mood-emoji::after {
  left: 60%;
  top: 10%;
  animation-delay: 0.5s;
}

/* ホバー時と選択時にアニメーション開始 */
.mood-very-bad:hover:not(:disabled) .mood-emoji::before,
.mood-very-bad:hover:not(:disabled) .mood-emoji::after,
.mood-very-bad.mood-selected .mood-emoji::before,
.mood-very-bad.mood-selected .mood-emoji::after {
  animation: tearDrop 2s infinite;
}

.mood-very-bad.mood-selected .mood-emoji::before,
.mood-very-bad.mood-selected .mood-emoji::after {
  animation-duration: 1s;
}

/* 😞 bad: 口が下がるアニメーション */
/* ホバー時と選択時にアニメーション開始 */
.mood-bad:hover:not(:disabled) .mood-emoji,
.mood-bad.mood-selected .mood-emoji {
  animation: sadMouth 2s ease-in-out infinite;
}

.mood-bad.mood-selected .mood-emoji {
  animation:
    sadMouth 1s ease-in-out infinite,
    moodPulse 0.4s ease;
}

/* 😐 neutral: 微細な動き */
/* ホバー時と選択時にアニメーション開始 */
.mood-neutral:hover:not(:disabled) .mood-emoji,
.mood-neutral.mood-selected .mood-emoji {
  animation: neutralBlink 3s ease-in-out infinite;
}

/* 😊 good: 目がキラキラ */
.mood-good .mood-emoji::before,
.mood-good .mood-emoji::after {
  content: '✨';
  position: absolute;
  font-size: 0.4rem;
  opacity: 0;
}

.mood-good .mood-emoji::before {
  left: 15%;
  top: 20%;
  animation-delay: 0s;
}

.mood-good .mood-emoji::after {
  left: 70%;
  top: 20%;
  animation-delay: 0.8s;
}

/* ホバー時と選択時にアニメーション開始 */
.mood-good:hover:not(:disabled) .mood-emoji::before,
.mood-good:hover:not(:disabled) .mood-emoji::after,
.mood-good.mood-selected .mood-emoji::before,
.mood-good.mood-selected .mood-emoji::after {
  animation: sparkle 2s infinite;
}

.mood-good.mood-selected .mood-emoji::before,
.mood-good.mood-selected .mood-emoji::after {
  animation-duration: 1s;
}

/* 😄 very-good: 目がキラキラ、口が大きく */
.mood-very-good .mood-emoji::before,
.mood-very-good .mood-emoji::after {
  content: '✨';
  position: absolute;
  font-size: 0.5rem;
  opacity: 0;
}

.mood-very-good .mood-emoji::before {
  left: 10%;
  top: 15%;
  animation-delay: 0s;
}

.mood-very-good .mood-emoji::after {
  left: 75%;
  top: 15%;
  animation-delay: 0.5s;
}

/* ホバー時と選択時にアニメーション開始 */
.mood-very-good:hover:not(:disabled) .mood-emoji {
  animation: happyBounce 2s ease-in-out infinite;
}

.mood-very-good:hover:not(:disabled) .mood-emoji::before,
.mood-very-good:hover:not(:disabled) .mood-emoji::after,
.mood-very-good.mood-selected .mood-emoji::before,
.mood-very-good.mood-selected .mood-emoji::after {
  animation: sparkle 1.5s infinite;
}

.mood-very-good.mood-selected .mood-emoji {
  animation:
    happyBounce 1s ease-in-out infinite,
    moodPulse 0.4s ease;
}

.mood-very-good.mood-selected .mood-emoji::before,
.mood-very-good.mood-selected .mood-emoji::after {
  animation-duration: 0.8s;
}

/* アニメーション定義 */
@keyframes tearDrop {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(150%) scale(1);
  }
}

@keyframes sadMouth {
  0%,
  100% {
    transform: scale(1.2) translateY(0);
  }
  50% {
    transform: scale(1.2) translateY(2px);
  }
}

@keyframes neutralBlink {
  0%,
  90%,
  100% {
    transform: scale(1.2) scaleY(1);
  }
  95% {
    transform: scale(1.2) scaleY(0.1);
  }
}

@keyframes sparkle {
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.5) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
}

@keyframes happyBounce {
  0%,
  100% {
    transform: scale(1.2) translateY(0) rotate(0deg);
  }
  25% {
    transform: scale(1.2) translateY(-3px) rotate(-2deg);
  }
  75% {
    transform: scale(1.2) translateY(-3px) rotate(2deg);
  }
}

@keyframes moodPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.2);
  }
}
</style>
