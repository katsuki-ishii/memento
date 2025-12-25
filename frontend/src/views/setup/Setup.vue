<!--
  初期設定ページ
  初回ログイン時にユーザーのプロフィール情報を設定するページです
  ユーザー名、生年、寿命、週開始日などを入力します
-->
<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
      <header class="space-y-2">
        <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">初期設定</p>
        <h1 class="text-3xl font-bold">プロフィールとライフグリッドの前提を入力</h1>
        <p class="text-sm text-gray-600">保存後、ダッシュボードに進みます。</p>
      </header>
      <!-- プロフィール設定フォーム -->
      <form class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">ユーザー名</span>
          <input
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Memento User"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">生年</span>
          <input
            type="number"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="1990"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">寿命（年）</span>
          <input
            type="number"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="85"
          />
        </label>
        <label class="space-y-1">
          <span class="text-sm font-medium text-gray-700">週開始</span>
          <select class="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="mon">月曜</option>
            <option value="sun">日曜</option>
          </select>
        </label>
        <label class="space-y-1 md:col-span-2">
          <span class="text-sm font-medium text-gray-700">テーマ</span>
          <select class="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="light">ライト</option>
            <option value="dark">ダーク</option>
          </select>
        </label>
      </form>
      <!-- アクションボタン -->
      <div class="flex gap-3">
        <button
          class="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition hover:bg-gray-800"
        >
          保存してダッシュボードへ
        </button>
        <RouterLink to="/" class="px-4 py-2 text-sm text-gray-600 underline underline-offset-4"
          >ホームに戻る</RouterLink
        >
      </div>
    </div>
  </main>
</template>
