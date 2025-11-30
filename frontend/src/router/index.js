import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 仮のセッション取得:
 * 今後 useAuthStore へ置き換える前提で sessionStorage を参照。
 * 保存フォーマットの暫定キー: "memento_auth" = { accessToken, isSetupComplete }
 */
const getAuthSession = () => {
  const storage =
    typeof globalThis !== 'undefined' && globalThis.sessionStorage
      ? globalThis.sessionStorage
      : null;

  try {
    if (!storage) return { isAuthenticated: false, isSetupComplete: false };

    const raw = storage.getItem('memento_auth');
    if (!raw) return { isAuthenticated: false, isSetupComplete: false };
    const parsed = JSON.parse(raw);
    return {
      isAuthenticated: Boolean(parsed?.accessToken),
      isSetupComplete: Boolean(parsed?.isSetupComplete),
    };
  } catch (error) {
    if (globalThis?.console) {
      globalThis.console.warn('Failed to parse auth session', error);
    }
    return { isAuthenticated: false, isSetupComplete: false };
  }
};

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isSetupComplete } = getAuthSession();

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

export default router;
