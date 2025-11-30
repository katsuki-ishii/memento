<template>
  <div class="flex min-h-screen flex-col bg-surface text-primary">
    <HeaderBar :show-nav="showNavButton" @toggle-nav="toggleNav" />

    <div class="relative flex flex-1">
      <transition name="slide">
        <SideNav
          v-if="showNavButton && navOpen"
          class="fixed inset-y-0 left-0 z-40 w-64 bg-card md:relative md:translate-x-0"
          @logout="handleLogout"
        />
      </transition>

      <main
        class="flex-1"
        :class="{
          'pl-64 hidden md:block': showNavButton,
        }"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderBar from './HeaderBar.vue';
import SideNav from './SideNav.vue';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

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

const handleLogout = () => {
  auth.clearSession();
  router.push({ name: 'auth-start' });
};
</script>

<style scoped>
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
