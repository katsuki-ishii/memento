import { createI18n } from 'vue-i18n';
import en from './messages/en.json';
import ja from './messages/ja.json';

export const SUPPORTED_LOCALES = ['ja', 'en'];
export const FALLBACK_LOCALE = 'en';

export const normalizeLocale = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const base = raw.toLowerCase().split('-')[0];
  return SUPPORTED_LOCALES.includes(base) ? base : null;
};

export const resolveBrowserLocale = () => {
  const navigatorObj = typeof globalThis !== 'undefined' ? globalThis.navigator : null;
  const candidates = Array.isArray(navigatorObj?.languages)
    ? navigatorObj.languages
    : [navigatorObj?.language].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) return normalized;
  }

  return FALLBACK_LOCALE;
};

export const i18n = createI18n({
  legacy: false,
  locale: FALLBACK_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  messages: {
    ja,
    en,
  },
});
