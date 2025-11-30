import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useUiStore } from '../stores/ui';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const ui = useUiStore();
  const auth = useAuthStore();

  auth.hydrateFromStorage();
  ui.startRouting();

  const isAuthenticated = auth.isAuthenticated;
  const isSetupComplete = auth.isSetupComplete;

  try {
    // 公開ルート: 認証済みユーザーはホーム/認証系からダッシュボードまたは初期設定へ誘導
    if (to.meta?.public) {
      if (
        isAuthenticated &&
        (to.name === 'home' || to.name === 'auth-start' || to.name === 'auth-callback')
      ) {
        return next(isSetupComplete ? { name: 'dashboard' } : { name: 'setup' });
      }
      return next();
    }

    // 認証必須
    if (to.meta?.requiresAuth && !isAuthenticated) {
      return next({ name: 'auth-start', query: { redirect: to.fullPath } });
    }

    // 初期設定未完ユーザーはダッシュボード等へ行かせず setup へ
    if (to.meta?.requiresSetup && isAuthenticated && !isSetupComplete) {
      return next({ name: 'setup', query: { redirect: to.fullPath } });
    }

    // すでに初期設定済みのユーザーが /setup に来た場合はダッシュボードへ
    if (to.name === 'setup' && isAuthenticated && isSetupComplete) {
      return next({ name: 'dashboard' });
    }

    return next();
  } catch (error) {
    if (globalThis?.console) {
      globalThis.console.error('Route guard error', error);
    }
    return next({ name: 'error' });
  }
});

router.afterEach(() => {
  const ui = useUiStore();
  ui.stopRouting();
});

router.onError(() => {
  const ui = useUiStore();
  ui.stopRouting();
});

export default router;
