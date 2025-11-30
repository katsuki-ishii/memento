import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// TODO: ガードで認証・初期設定の判定を実装する
router.beforeEach((to, from, next) => {
  // 仮実装: 何もせず通す
  next();
});

export default router;
