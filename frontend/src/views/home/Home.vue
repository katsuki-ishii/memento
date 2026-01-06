<!--
  ホームページ
  アプリケーションのランディングページです
  Mementoの哲学を伝え、認証へ誘導します
-->
<template>
  <main class="relative min-h-screen bg-white">
    <!-- コンテンツ -->
    <div class="relative mx-auto flex min-h-screen max-w-6xl items-center px-8 py-20 lg:px-16">
      <div class="w-full max-w-2xl">
        <!-- ロゴ -->
        <p
          class="animate-fade-in-up mb-16 text-xs font-medium tracking-[0.3em] text-gray-400 opacity-0"
        >
          MEMENTO
        </p>

        <!-- メインコピー -->
        <h1
          class="animate-fade-in-up animation-delay-200 text-2xl font-medium leading-loose tracking-wide text-gray-900 opacity-0 md:text-3xl lg:text-4xl"
        >
          <span class="block">時間はもっとも貴重なリソースです。</span>
          <span class="mt-4 block">
            しかし、人は寿命が長すぎて<br class="hidden sm:inline" />
            その尊さを認識できていません。
          </span>
        </h1>

        <!-- 区切り線 -->
        <div
          class="animate-fade-in-up animation-delay-400 my-12 h-px w-24 bg-gray-200 opacity-0"
        ></div>

        <!-- サブコピー -->
        <p
          class="animate-fade-in-up animation-delay-400 max-w-md text-base leading-relaxed text-gray-500 opacity-0 md:text-lg"
        >
          人生を週単位で可視化し、<br />
          すでに使った時間と、これからの時間を見つめ直しましょう。
        </p>

        <!-- アクションボタン -->
        <div class="animate-fade-in-up animation-delay-600 mt-16 opacity-0">
          <RouterLink
            to="/auth/start"
            class="group inline-flex items-center gap-3 border-b border-gray-900 pb-2 text-sm tracking-wider text-gray-900 transition-all hover:gap-4 hover:border-gray-500 hover:text-gray-500"
          >
            <span>はじめる</span>
            <svg
              class="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- フッター -->
    <footer class="absolute bottom-0 left-0 right-0 px-8 py-6 lg:px-16">
      <p class="text-xs tracking-wide text-gray-400">© {{ currentYear }} Memento</p>
    </footer>
  </main>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
