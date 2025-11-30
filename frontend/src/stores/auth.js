import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const STORAGE_KEY = 'memento_auth';

const getStorage = () => (typeof globalThis !== 'undefined' ? globalThis.sessionStorage : null);

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const isSetupComplete = ref(false);
  const hydrated = ref(false);

  const isAuthenticated = computed(() => Boolean(accessToken.value));

  const hydrateFromStorage = () => {
    if (hydrated.value) return;
    const storage = getStorage();
    if (!storage) {
      hydrated.value = true;
      return;
    }
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        hydrated.value = true;
        return;
      }
      const parsed = JSON.parse(raw);
      accessToken.value = parsed?.accessToken ?? null;
      refreshToken.value = parsed?.refreshToken ?? null;
      isSetupComplete.value = Boolean(parsed?.isSetupComplete);
    } catch (error) {
      if (globalThis?.console) {
        globalThis.console.warn('auth hydrate failed', error);
      }
    } finally {
      hydrated.value = true;
    }
  };

  const persist = () => {
    const storage = getStorage();
    if (!storage) return;
    const payload = {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      isSetupComplete: isSetupComplete.value,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const setSession = (tokens) => {
    accessToken.value = tokens?.accessToken ?? null;
    refreshToken.value = tokens?.refreshToken ?? null;
    persist();
  };

  const markSetupComplete = () => {
    isSetupComplete.value = true;
    persist();
  };

  const clearSession = () => {
    accessToken.value = null;
    refreshToken.value = null;
    isSetupComplete.value = false;
    const storage = getStorage();
    if (storage) storage.removeItem(STORAGE_KEY);
  };

  return {
    // state
    accessToken,
    refreshToken,
    isSetupComplete,
    hydrated,
    // getters
    isAuthenticated,
    // actions
    hydrateFromStorage,
    setSession,
    markSetupComplete,
    clearSession,
  };
});
