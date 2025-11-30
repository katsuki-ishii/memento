import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../auth';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    if (globalThis?.sessionStorage) {
      globalThis.sessionStorage.clear();
    }
  });

  it('persists session to sessionStorage', () => {
    const store = useAuthStore();
    store.setSession({ accessToken: 'access', refreshToken: 'refresh' });
    store.markSetupComplete();

    const raw = globalThis?.sessionStorage?.getItem('memento_auth');
    const saved = raw ? JSON.parse(raw) : null;
    expect(saved).toMatchObject({
      accessToken: 'access',
      refreshToken: 'refresh',
      isSetupComplete: true,
    });
  });

  it('hydrates from sessionStorage', () => {
    if (globalThis?.sessionStorage) {
      globalThis.sessionStorage.setItem(
        'memento_auth',
        JSON.stringify({ accessToken: 'a', refreshToken: 'r', isSetupComplete: true })
      );
    }

    const store = useAuthStore();
    store.hydrateFromStorage();

    expect(store.isAuthenticated).toBe(true);
    expect(store.refreshToken).toBe('r');
    expect(store.isSetupComplete).toBe(true);
  });
});
