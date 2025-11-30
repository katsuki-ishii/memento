import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null);
  const loading = ref(false);

  const setProfile = (value) => {
    profile.value = value;
  };

  const setLoading = (value) => {
    loading.value = Boolean(value);
  };

  return {
    profile,
    loading,
    setProfile,
    setLoading,
  };
});
