/**
 * Vue Router の設定
 * ページ遷移の制御と認証ガード（認証が必要なページへのアクセス制御）を実装します
 */

import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useUiStore } from '../stores/ui';
import { useAuthStore } from '../stores/auth';

// ルーターインスタンスを作成
// createWebHistory は HTML5 History API を使用（URL に # が付かない）
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * ナビゲーションガード: ページ遷移前に実行される処理
 * 認証状態や初期設定の完了状態をチェックして、適切なページへ誘導します
 */
router.beforeEach((to, from, next) => {
  const ui = useUiStore();
  const auth = useAuthStore();

  // セッションストレージから認証情報を復元（ページリロード時などに対応）
  auth.hydrateFromStorage();
  // ルーティング開始を UI ストアに通知（プログレス表示のため）
  ui.startRouting();

  const isAuthenticated = auth.isAuthenticated;
  const isSetupComplete = auth.isSetupComplete;

  try {
    // 公開ルート（認証不要なページ）の処理
    // 認証済みユーザーがホームや認証ページにアクセスした場合は、
    // 初期設定の完了状態に応じてダッシュボードまたは初期設定ページへ誘導
    if (to.meta?.public) {
      if (
        isAuthenticated &&
        (to.name === 'home' || to.name === 'auth-start' || to.name === 'auth-callback')
      ) {
        return next(isSetupComplete ? { name: 'dashboard' } : { name: 'setup' });
      }
      return next();
    }

    // 認証必須のページへのアクセス制御
    // 未認証の場合は認証開始ページへリダイレクト（元のページは query パラメータで保持）
    if (to.meta?.requiresAuth && !isAuthenticated) {
      return next({ name: 'auth-start', query: { redirect: to.fullPath } });
    }

    // 初期設定完了が必須のページへのアクセス制御
    // 認証済みだが初期設定未完了の場合は、初期設定ページへ誘導
    if (to.meta?.requiresSetup && isAuthenticated && !isSetupComplete) {
      return next({ name: 'setup', query: { redirect: to.fullPath } });
    }

    // 初期設定済みユーザーが初期設定ページにアクセスした場合の処理
    // 既に設定済みなので、ダッシュボードへ誘導
    if (to.name === 'setup' && isAuthenticated && isSetupComplete) {
      return next({ name: 'dashboard' });
    }

    // すべてのチェックを通過した場合は、通常通り遷移を許可
    return next();
  } catch (error) {
    // エラーが発生した場合はエラーページへ誘導
    if (globalThis?.console) {
      globalThis.console.error('Route guard error', error);
    }
    return next({ name: 'error' });
  }
});

/**
 * ナビゲーション完了後の処理
 * ルーティングプログレス表示を停止します
 */
router.afterEach(() => {
  const ui = useUiStore();
  ui.stopRouting();
});

/**
 * ルーティングエラー時の処理
 * エラーが発生した場合もプログレス表示を停止します
 */
router.onError(() => {
  const ui = useUiStore();
  ui.stopRouting();
});

export default router;
