<template>
  <AppShell>
    <RouterView />
  </AppShell>
  <RouteProgress />
</template>

<script setup>
import { onMounted } from 'vue';
import { useUiStore } from './stores/ui';
import AppShell from './components/layout/AppShell.vue';
import RouteProgress from './components/layout/RouteProgress.vue';

const ui = useUiStore();

onMounted(() => {
  ui.hydrateTheme();
});
</script>
