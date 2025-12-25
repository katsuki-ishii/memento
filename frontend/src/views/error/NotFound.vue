<!--
  404 ページ（ページが見つからない）
  存在しない URL にアクセスした際に表示されるページです
  ルーターの routes.js で最後に定義された catch-all ルートで表示されます
-->
<template>
  <main class="flex min-h-screen items-center justify-center bg-white text-gray-900">
    <div class="text-center space-y-3">
      <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">404</p>
      <h1 class="text-3xl font-bold">ページが見つかりません</h1>
      <RouterLink to="/" class="text-sm text-gray-600 underline underline-offset-4"
        >ホームに戻る</RouterLink
      >
    </div>
  </main>
</template>
