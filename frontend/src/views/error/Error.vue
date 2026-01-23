<!--
  エラーページ
  アプリケーションでエラーが発生した際に表示されるページです
  ルーターガードでエラーが発生した場合などに表示されます
-->
<template>
  <main class="grid min-h-screen place-items-center bg-white px-6 py-16 text-gray-900">
    <div class="max-w-md space-y-4 text-center">
      <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">
        エラーが発生しました
      </p>
      <h1 class="text-3xl font-bold">問題が発生しました</h1>
      <p class="text-sm text-gray-600">
        一時的な問題が発生したか、リクエストを完了できませんでした。時間をおいて再度お試しください。
      </p>
      <!-- ナビゲーションリンク -->
      <div class="flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          to="/dashboard"
          class="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition hover:bg-gray-800"
        >
          ホームへ戻る
        </RouterLink>
        <RouterLink
          to="/"
          class="rounded-md border border-gray-300 px-4 py-2 text-gray-900 transition hover:border-gray-400"
        >
          ホームへ
        </RouterLink>
      </div>
    </div>
  </main>
</template>
