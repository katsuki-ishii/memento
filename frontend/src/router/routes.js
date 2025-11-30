import Home from '../views/home/Home.vue';
import AuthStart from '../views/auth/AuthStart.vue';
import AuthCallback from '../views/auth/AuthCallback.vue';
import Setup from '../views/setup/Setup.vue';
import Dashboard from '../views/dashboard/Dashboard.vue';
import ErrorPage from '../views/error/Error.vue';
import NotFound from '../views/error/NotFound.vue';
import Unauthorized from '../views/error/Unauthorized.vue';

export const routes = [
  { path: '/', name: 'home', component: Home, meta: { public: true } },
  { path: '/auth/start', name: 'auth-start', component: AuthStart, meta: { public: true } },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: AuthCallback,
    meta: { public: true, isCallback: true },
  },
  {
    path: '/setup',
    name: 'setup',
    component: Setup,
    meta: { requiresAuth: true, setupOnly: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresSetup: true },
  },
  { path: '/error', name: 'error', component: ErrorPage, meta: { public: true } },
  { path: '/unauthorized', name: 'unauthorized', component: Unauthorized, meta: { public: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { public: true } },
];
