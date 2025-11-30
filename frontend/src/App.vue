<template>
  <AppShell>
    <RouterView />
  </AppShell>
  <RouteProgress />
  <GlobalSpinner />
  <ToastStack />
</template>

<script setup>
import { onMounted } from 'vue';
import { useUiStore } from './stores/ui';
import AppShell from './components/layout/AppShell.vue';
import GlobalSpinner from './components/layout/GlobalSpinner.vue';
import RouteProgress from './components/layout/RouteProgress.vue';
import ToastStack from './components/layout/ToastStack.vue';

const ui = useUiStore();

onMounted(() => {
  ui.hydrateTheme();
});
</script>
