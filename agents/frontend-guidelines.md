# frontend-guidelines.md

## 1. 基本原則

- ロジックはすべて composables に集約する。
- コンポーネントは UI とイベント配線に特化させる。
- setup は長くなりすぎないようにし、肥大化した部分は composables へ移動する。
- Options API の構造（data、methods など）は残さない。
- 関数・変数は用途が一読で分かる命名にする。

## 2. ディレクトリ構造の原則

Memento の画面フロー（ホーム→認証→初期設定→ダッシュボード）とライフグリッド/イベント機能に合わせて、ページ単位で UI を閉じつつ、ロジック・API・状態を機能別にそろえる。

### 推奨構造

```jsx
src /
  assets /
  components /
  common / // 再利用 UI（ボタン、フォーム部品、モーダル等）
  layout / // ヘッダー、サイドバー、シェル
  composables / // ロジック（状態・副作用・計算）
  auth /
  settings /
  events /
  grid /
  shared /
  services / // API 呼び出し専用レイヤー（fetch/Axiosラッパ）
  http /
  authService.js;
settingsService.js;
eventsService.js;

stores / // 画面横断で共有する state（Pinia）
  authStore.js;
userStore.js;
eventStore.js;
uiStore.js; // トースト/ダイアログ等のUI状態

router / index.js; // ルーター初期化・ガード
routes.js; // ルート定義（/ /auth /auth/callback /setup /dashboard /error）

views / // 画面単位のコンテナ
  home /
  Home.vue;
components / auth / AuthStart.vue;
AuthCallback.vue;
setup / Setup.vue;
dashboard / Dashboard.vue;
components / GridCanvas.vue;
SummaryPanel.vue;
EventDrawer.vue;
error / NotFound.vue;
Unauthorized.vue;

styles / tailwind.css;

App.vue;
main.js;
```

### この構造を推奨する理由

- 認証→初期設定→ダッシュボードのガード実装を `router/` に閉じ込め、ビューと分離できる。
- ライフグリッド/イベントなど機能別に composables・services・stores を並べ、責務を追いやすい。
- ページ固有 UI は views 配下に閉じ、再利用部品は components/common へ昇格させる流れが明確。
- services と stores の階層を合わせることで API と状態の対応を把握しやすい。
- styles を分離して Tailwind 設定の配置を固定できる。

### reactive を使うケース

- フォーム入力のように複数の値がセットで扱われる場合
- “オブジェクトとしてのまとまり”が強い状態

```jsx
const form = reactive({
  name: '',
  age: null,
  email: '',
});
```

### チーム向け追加ガイドライン

- 深いネストが必要な場合は reactive を避ける（追跡が難しくなるため）。
- reactive を返す場合は構造が固定されていることが前提となる。
- composables の返り値は ref を基本とし、必要最小限だけ reactive を返す。
- API の生データは ref に入れて、加工は computed で行う。

---

## 3. composables の設計方針

- composables は必ず関数として定義し、必要な値・関数のみ返す。
- UI や DOM に依存するコードは含めない。
- サービス（API 呼び出し）を内部で使用してもよいが、state 管理は composable 側で行う。
- 必要であれば機能別フォルダで整理する。

### composable の例

```jsx
// src/composables/user/useUser.js
import { ref, computed } from 'vue';
import { getUser, updateUser as updateUserApi } from '@/services/userService';

export function useUser() {
  const user = ref(null);
  const isLoading = ref(false);

  async function loadUser() {
    isLoading.value = true;
    try {
      user.value = await getUser();
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(payload) {
    await updateUserApi(payload);
    user.value = payload;
  }

  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.first} ${user.value.last}`;
  });

  return {
    user,
    isLoading,
    fullName,
    loadUser,
    updateUser,
  };
}
```

## 4. services の設計方針

- services は API 呼び出し専用にする。
- axios などの HTTP クライアント設定は src/services/http/ に集約する。
- 返り値の整形以上のロジックは composables へ寄せる。

### service の例

```jsx
// src/services/userService.js
import http from './http/axios';

export function getUser() {
  return http.get('/user');
}

export function updateUser(payload) {
  return http.post('/user/update', payload);
}
```

## 5. Pinia ストアの方針

- 画面を跨いで必要な state を保持することを基本とする。
- ただし **同一画面内の複数コンポーネント間で状態共有が必要で、props 受け渡しが複雑になる場合は Pinia を使用してよい**。
- composables はローカルな機能単位の状態保持に使う。
- store へ入れる state は「共有したい理由」が明確であることを条件とする。

### Pinia を使うべきケース

- 画面を跨いで使うユーザー情報や設定値。
- 同一画面内で複数コンポーネント間にまたがる状態を共有する必要があり、props バケツリレーが煩雑になる場合。
- 複雑な UI 状態（タブ、フィルター、選択状態など）を複数コンポーネントで扱う場合。

### Pinia を使わない方がよいケース

- 単一コンポーネント内で完結する状態。
- 一時的な UI 状態（モーダル開閉、ローカルな検索キーワードなど）。
- composables で簡単に共有できる程度の軽い状態。

### ストアの例

```jsx
// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isFetching: false,
  }),
  actions: {
    setUser(payload) {
      this.user = payload;
    },
    setFetching(flag) {
      this.isFetching = flag;
    },
  },
});
```

## 6. 命名規則

プロジェクト全体で一貫性を保つため、以下の命名規則を遵守する。

### 基本ルール

- **コンポーネント名**: PascalCase、複数単語を使用（例: `HeaderBar.vue`, `AppShell.vue`）
  - 理由: HTML 要素との衝突を避け、将来の HTML 要素や予約語との競合を防ぐため。単一単語（例: `Button`, `Input`）は避ける。
- **変数・関数名**: camelCase（例: `userName`, `loadUser`, `handleClick`）
- **定数名**: `UPPER_SNAKE_CASE`（再代入されない定数のみ、例: `MAX_RETRY_COUNT`, `API_BASE_URL`）
- **boolean 変数**: `is`, `has`, `should`, `can` などのプレフィックスを使用（例: `isModalOpen`, `hasPermission`）
- **配列**: 複数形の名詞を使用（例: `users`, `items`, `weeks`）

### 特殊な命名

- **Composables**: `use` プレフィックス（例: `useUser`, `useAuth`）
- **Pinia ストア**: `useXxxStore` 形式、ストア ID は kebab-case（例: `useUserStore = defineStore('user', ...)`）
- **サービスファイル**: `xxxService.js` 形式、関数は動詞で始める（例: `getUser`, `updateUser`）
- **イベントハンドラ**: `handle` プレフィックス（例: `handleClick`, `handleSubmit`）
- **Props**: camelCase、名詞または形容詞（例: `userName`, `isVisible`）
- **Emits**: camelCase、動詞または動詞句（例: `update`, `save`, `close`）
- **CSS クラス**: Tailwind を優先、カスタムクラスは kebab-case

## 7. コンポーネントの設計

- 再利用可能な UI 部品は components/common に配置する。
- layout 系（ヘッダー、サイドバー）は components/layout に分離する。
- 特定ページに属する UI 部品は components/feature 下に置く。
- コンポーネントにはビジネスロジックを入れず composables から取得する。

### コンポーネント例

```jsx
<script setup>
import { ref, onMounted } from 'vue'
import { useUser } from '@/composables/user/useUser'

const { user, loadUser, updateUser } = useUser()
const isModalOpen = ref(false)

function openModal() {
  isModalOpen.value = true
}

function save() {
  updateUser(user.value)
  isModalOpen.value = false
}

onMounted(loadUser)
</script>

<template>
  <div>
    <p>{{ user?.name }}</p>
    <button @click="openModal">編集</button>
    <EditModal v-if="isModalOpen" @save="save" @close="isModalOpen = false" />
  </div>
</template>

```

## 8. setup の構造

以下の順番を統一的に採用する。

1. import
2. state（ref, reactive）
3. computed
4. methods（関数）
5. watch
6. lifecycle hooks
7. return

## 9. watch と computed の方針

### computed の方針

- computed は値の導出専用とし、副作用を入れない。
- 依存する値が変更されたときのみ再計算されるため、パフォーマンス面でも有利。
- テンプレート内で複数回参照される値は computed に置き換える。

```jsx
// 良い例
const fullName = computed(() => {
  if (!user.value) return '';
  return `${user.value.first} ${user.value.last}`;
});

// 悪い例（副作用を含む）
const fullName = computed(() => {
  console.log('計算中'); // 副作用
  return `${user.value.first} ${user.value.last}`;
});
```

### watch の方針

- watch は副作用が必要な場合にのみ使う。
- 可能であればイベント伝播や明示的な関数呼び出しで代替する。
- 複数のソースを監視する場合は配列形式を使用する。

#### watch を使うべきケース

- ルートパラメータやクエリパラメータの変更を監視する場合。
- 外部ライブラリとの連携（例: チャートライブラリの更新）。
- フォームバリデーションの非同期処理。
- ローカルストレージへの自動保存。

#### watch を使わない方がよいケース

- ユーザーアクションに直接反応する処理（イベントハンドラで対応）。
- 親コンポーネントからの props 変更（computed や props の直接参照で対応可能な場合）。

#### watch の実装パターン

```jsx
// 基本的な使い方
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    // 副作用処理
    navOpen.value = false;
  }
);

// 複数のソースを監視
watch(
  [() => user.value?.id, () => filter.value],
  ([newUserId, newFilter], [oldUserId, oldFilter]) => {
    // 両方の変更に反応
  }
);

// immediate オプション（初期実行が必要な場合）
watch(
  () => props.id,
  (newId) => {
    loadData(newId);
  },
  { immediate: true }
);

// deep オプション（オブジェクトの深い変更を監視）
watch(
  () => form.value,
  (newForm) => {
    validateForm(newForm);
  },
  { deep: true }
);

// watchEffect（依存関係を自動追跡）
watchEffect(() => {
  if (user.value?.id) {
    loadUserData(user.value.id);
  }
});
```

#### watch の停止

- コンポーネントがアンマウントされる前に watch を停止する必要がある場合は、watch の戻り値（stop 関数）を保存して `onUnmounted` で呼び出す。

```jsx
const stopWatcher = watch(() => route.path, handleRouteChange);
onUnmounted(() => {
  stopWatcher();
});
```

## 10. ディレクティブの方針

### v-if と v-show の使い分け

- **v-if**: 条件が false のとき DOM に要素が存在しない。切り替えコストが高いが、初期レンダリングが軽い。初期表示が不要な要素や、切り替え頻度が低い要素に使用。
- **v-show**: 条件が false のとき `display: none` で非表示。切り替えコストが低いが、常に DOM に存在する。切り替え頻度が高い要素（タブ、モーダルなど）に使用。

```jsx
// v-if を使うケース（初期表示が不要、切り替えが少ない）
<div v-if="isAdmin">
  <AdminPanel />
</div>

// v-show を使うケース（頻繁に切り替わる）
<nav v-show="isMenuOpen">
  <MenuItems />
</nav>
```

### v-for の方針

- **key 属性は必須**。一意で安定した値を使用する（配列のインデックスは避ける）。
- オブジェクトの id や、複合キー（例: `${item.type}-${item.id}`）を使用する。
- **`in` と `of` の使い分け**: プロジェクト内で統一する。Vue の公式ドキュメントに合わせて **`in` を推奨**する。

```jsx
// 良い例（in を使用）
<div v-for="week in weeks" :key="week.id">
  {{ week.label }}
</div>

// 悪い例（インデックスを key に使用）
<div v-for="(week, index) in weeks" :key="index">
  {{ week.label }}
</div>

// オブジェクトの v-for（key は必須）
<div v-for="(value, key) in object" :key="key">
  {{ key }}: {{ value }}
</div>

// インデックスが必要な場合（key には id を使用）
<div v-for="(week, index) in weeks" :key="week.id">
  {{ index + 1 }}. {{ week.label }}
</div>
```

**注意**: `in` と `of` は機能的に同じだが、プロジェクト内で統一する。Vue の公式ドキュメントでは `in` が使用されているため、`in` を推奨する。

### v-model の方針

- フォーム要素との双方向バインディングに使用。
- カスタムコンポーネントで v-model を使用する場合は、`modelValue` props と `update:modelValue` emit を定義する。

```jsx
// 基本的な使い方
<input v-model="searchText" type="text" />

// カスタムコンポーネントでの v-model
// 親コンポーネント
<CustomInput v-model="userName" />

// 子コンポーネント（CustomInput.vue）
<script setup>
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

function updateValue(newValue) {
  emit('update:modelValue', newValue);
}
</script>
```

### イベントハンドラの命名

- イベントハンドラは `handle` または動詞で始める（`handleClick`, `save`, `close` など）。
- テンプレート内では簡潔な名前を使用し、複雑な処理は関数に分離する。

```jsx
// 良い例
<button @click="handleSave">保存</button>
<button @click="close">閉じる</button>

// 悪い例（テンプレート内に複雑なロジック）
<button @click="user.value && user.value.id ? updateUser(user.value) : createUser(user.value)">
  保存
</button>
```

### ディレクティブの記法

- **省略記法を推奨**: `v-bind` は `:`、`v-on` は `@` を使用する。
- 明示的な `v-bind` や `v-on` の記述は避ける（可読性と簡潔性のため）。

```jsx
// 推奨（省略記法）
<div :class="itemClass" @click="handleClick">
  {{ item.name }}
</div>

// 非推奨（明示的記法）
<div v-bind:class="itemClass" v-on:click="handleClick">
  {{ item.name }}
</div>
```

### ディレクティブの順序

複数のディレクティブを同じ要素に使用する場合、以下の順序を推奨する：

1. `v-if` / `v-show` / `v-for`
2. `:`（属性バインディング）
3. `v-model`
4. `@`（イベントハンドラ）
5. `v-html` / `v-text`（使用は最小限に）

```jsx
// 推奨順序
<div
  v-if="isVisible"
  v-for="item in items"
  :key="item.id"
  :class="itemClass"
  @click="handleClick"
>
  {{ item.name }}
</div>
```

### その他のディレクティブ

- **v-html**: XSS のリスクがあるため、信頼できるソースからのみ使用。可能な限り避ける。
- **v-text**: 通常は `{{ }}` で十分。特別な理由がない限り使用しない。
- **v-once**: 一度だけレンダリングする。パフォーマンス最適化が必要な場合のみ使用。

## 11. props / emits

- defineProps / defineEmits を用いる。
- props のデフォルト値は必要に応じて親で明示する。
- emits は UI の動作を表す名前にする（save, close など）。

## 12. views の方針

- ページの読み込みや画面遷移に関する最小限の処理だけを書く。
- ロジックは composables へ逃がす。
- 不要な再レンダリングを避けるため state をストアに過剰に置かない。

## 13. ref と reactive の使い分け指針

Vue の思想である「明確で予測可能なリアクティビティ」を保つため、ref と reactive の使い分けはチームで統一する。

基本原則

- 単一値（文字列、数値、真偽値など）は ref を使う。
- 複数プロパティで1つの意味を成す“まとまり”は reactive を使う。
- 返り値として UI から利用されることを考えると ref の方が扱いやすい。
- reactive は便利だが、状態追跡が複雑になるため必要なときだけ使う。

ref を使うケース

- フラグ（モーダル開閉など）
- 数値・文字列など単純な状態
- API レスポンスの保持（構造が安定しない場合）

## 14. レビュー観点

- setup の構成順序は守られているか。
- ロジックが composables へ適切に分離されているか。
- 命名規則が遵守されているか（コンポーネント名、変数名、関数名など）。
- 命名が用途を的確に表しているか。
- services が API 呼び出し専用として保たれているか。
- views や components が肥大化していないか。
- stores に余計なロジックが入っていないか。
- watch の使用が適切か（イベントハンドラで代替できないか）。
- ディレクティブの使い分けが適切か（v-if vs v-show、v-for の key など）。

## 15. 肥大化判断基準（コンポーネント・composables・stores）

### コンポーネント（views / components）

- setup が 150 行を超えた場合は分割を検討する。
- 関数が 10 個を超える場合は責務過多と判断する。
- template が 200 行を超える場合は部分コンポーネント化を検討する。
- props が 8 個以上の場合はコンポーネント分割を検討する。

### composables

- ファイルが 200 行を超える場合はロジック分割を検討する。
- return する変数や関数が 11 個以上になった場合は責務を分割する。
- watch が 3 つ以上ある場合はロジックが集中しすぎている可能性がある。

### stores（Pinia）

- state が 10 項目以上ある場合は store の責務過多と判断する。
- actions が 10 個以上ある場合はロジックを composables に移すことを検討する。
- 単一画面でしか使わない state は composables または component 側に移動する。

これらの基準をもとに、コンポーネントや composables、store の責務が適切に分担されているかを確認することを推奨する。
