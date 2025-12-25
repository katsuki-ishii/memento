// Vue アプリケーションのエントリーポイント
// このファイルはアプリケーションの起動時に最初に実行されます

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

// Vue アプリケーションインスタンスを作成
const app = createApp(App);

// Pinia（状態管理ライブラリ）をアプリケーションに登録
// これにより、stores ディレクトリ内のストアが使用可能になります
app.use(createPinia());

// Vue Router（ルーティングライブラリ）をアプリケーションに登録
// これにより、ページ遷移が可能になります
app.use(router);

// アプリケーションを #app 要素にマウント（DOM に接続）
// index.html 内の <div id="app"></div> にアプリケーションが表示されます
app.mount('#app');
