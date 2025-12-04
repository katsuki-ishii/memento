<template>
  <div class="flex min-h-screen flex-col bg-surface text-primary">
    <HeaderBar :show-nav="showNavButton" @toggle-nav="toggleNav" />

    <div class="pointer-events-none fixed inset-0 z-40">
      <transition name="fade">
        <div
          v-if="showNavButton && navOpen"
          class="pointer-events-auto absolute inset-0 bg-black/50"
          aria-hidden="true"
          @click="closeNav"
        />
      </transition>

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

const navOpen = ref(false);

const showNavButton = computed(() => route.name === 'dashboard');

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false;
  }
);

const toggleNav = () => {
  navOpen.value = !navOpen.value;
};

const closeNav = () => {
  navOpen.value = false;
};

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
