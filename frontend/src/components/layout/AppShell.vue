<!--
  アプリケーションシェルコンポーネント
  すべてのページで共通して使用されるレイアウト（ヘッダー、サイドナビゲーション）を提供します
-->
<template>
  <div class="flex min-h-screen flex-col bg-surface text-primary">
    <!-- ヘッダーバー（ロゴ、ナビゲーションボタン、テーマ切替など） -->
    <HeaderBar :show-nav="showNavButton" @toggle-nav="toggleNav" />

    <!-- サイドナビゲーションのオーバーレイとメニュー -->
    <!-- pointer-events-none で親要素のクリックイベントを無効化し、
         子要素（オーバーレイとメニュー）のみ pointer-events-auto で有効化 -->
    <div class="pointer-events-none fixed inset-0 z-40">
      <!-- オーバーレイ（背景の半透明な黒いレイヤー） -->
      <transition name="fade">
        <div
          v-if="showNavButton && navOpen"
          class="pointer-events-auto absolute inset-0 bg-black/50"
          aria-hidden="true"
          @click="closeNav"
        />
      </transition>

      <!-- サイドナビゲーションメニュー -->
      <transition name="slide">
        <SideNav
          v-if="showNavButton && navOpen"
          class="pointer-events-auto absolute top-0 left-0 h-screen w-64 bg-card shadow-lg"
          :show-close="true"
          @logout="handleLogout"
          @close="closeNav"
        />
      </transition>
    </div>

    <!-- メインコンテンツエリア -->
    <!-- slot には各ページのコンテンツが挿入されます -->
    <main class="flex-1 min-w-0">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderBar from './HeaderBar.vue';
import SideNav from './SideNav.vue';
import { startLogout } from '../../services/authService';

const route = useRoute();
const router = useRouter();

// サイドナビゲーションの開閉状態
const navOpen = ref(false);

// ダッシュボードページでのみナビゲーションボタンを表示
const showNavButton = computed(() => route.name === 'dashboard');

// ルートが変更されたらサイドナビを自動的に閉じる
watch(
  () => route.fullPath,
  () => {
    navOpen.value = false;
  }
);

/**
 * サイドナビゲーションの開閉を切り替え
 */
const toggleNav = () => {
  navOpen.value = !navOpen.value;
};

/**
 * サイドナビゲーションを閉じる
 */
const closeNav = () => {
  navOpen.value = false;
};

/**
 * ログアウト処理
 * 認証サービスを呼び出してログアウトします
 * リダイレクトが行われない場合は、認証開始ページへ遷移します
 */
const handleLogout = () => {
  const result = startLogout();
  if (!result?.performedRedirect) {
    router.push({ name: 'auth-start' });
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
