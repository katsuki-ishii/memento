import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { updateSettings } from '../services/settingsService';
import { useProfileStore } from '../stores/profile';
import { FALLBACK_LOCALE, normalizeLocale, resolveBrowserLocale } from '../i18n';

const setDocumentLang = (value) => {
  if (!globalThis?.document?.documentElement) return;
  globalThis.document.documentElement.lang = value;
};

export const useLocale = () => {
  const profileStore = useProfileStore();
  const { locale } = useI18n();
  const isSaving = ref(false);

  const currentLocale = computed(() => locale.value);

  const applyLocale = (value) => {
    const normalized = normalizeLocale(value) || FALLBACK_LOCALE;
    if (locale.value !== normalized) {
      locale.value = normalized;
    }
    setDocumentLang(normalized);
    return normalized;
  };

  const persistLocale = async (nextLocale) => {
    if (!profileStore.profile || isSaving.value) return;
    isSaving.value = true;
    try {
      const updated = await updateSettings({ locale: nextLocale });
      profileStore.updateProfile(updated || { locale: nextLocale });
    } catch (error) {
      if (globalThis?.console) {
        globalThis.console.error('Locale save error', error);
      }
    } finally {
      isSaving.value = false;
    }
  };

  const detectAndApply = async () => {
    const detected = applyLocale(resolveBrowserLocale());
    if (profileStore.profile && !profileStore.profile?.locale) {
      await persistLocale(detected);
    }
  };

  watch(
    () => profileStore.profile?.locale,
    async (nextLocale) => {
      if (nextLocale) {
        applyLocale(nextLocale);
        return;
      }

      if (!profileStore.profile) {
        applyLocale(resolveBrowserLocale());
        return;
      }

      await detectAndApply();
    },
    { immediate: true }
  );

  const setLocale = async (nextLocale) => {
    const normalized = applyLocale(nextLocale);
    await persistLocale(normalized);
  };

  return {
    locale: currentLocale,
    isSaving,
    setLocale,
  };
};
