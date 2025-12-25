/**
 * ルート定義
 * アプリケーション内のすべてのページ（ルート）を定義します
 * meta プロパティで各ページのアクセス制御要件を指定します
 */

import Home from '../views/home/Home.vue';
import AuthStart from '../views/auth/AuthStart.vue';
import AuthCallback from '../views/auth/AuthCallback.vue';
import Setup from '../views/setup/Setup.vue';
import Dashboard from '../views/dashboard/Dashboard.vue';
import ErrorPage from '../views/error/Error.vue';
import NotFound from '../views/error/NotFound.vue';
import Unauthorized from '../views/error/Unauthorized.vue';

export const routes = [
  // ホームページ（公開）
  { path: '/', name: 'home', component: Home, meta: { public: true } },

  // 認証開始ページ（公開）
  { path: '/auth/start', name: 'auth-start', component: AuthStart, meta: { public: true } },

  // 認証コールバックページ（公開）
  // OAuth 認証後に Cognito からリダイレクトされるページ
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: AuthCallback,
    meta: { public: true, isCallback: true },
  },

  // 初期設定ページ（認証必須）
  // 認証済みユーザーが初回ログイン時にプロフィールを設定するページ
  {
    path: '/setup',
    name: 'setup',
    component: Setup,
    meta: { requiresAuth: true, setupOnly: true },
  },

  // ダッシュボード（認証必須 + 初期設定完了必須）
  // メインの機能ページ。ライフグリッドを表示します
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresSetup: true },
  },

  // エラーページ（公開）
  { path: '/error', name: 'error', component: ErrorPage, meta: { public: true } },

  // 認証エラーページ（公開）
  { path: '/unauthorized', name: 'unauthorized', component: Unauthorized, meta: { public: true } },

  // 404 ページ（公開）
  // すべての未定義パスにマッチする（最後に配置する必要がある）
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { public: true } },
];
