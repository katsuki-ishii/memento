<!--
  401 ページ（認証エラー）
  認証が必要なページに未認証でアクセスした際に表示されるページです
  現在はルーターガードで認証開始ページへリダイレクトするため、このページが表示されることは少ないです
-->
<template>
  <main class="flex min-h-screen items-center justify-center bg-white text-gray-900">
    <div class="text-center space-y-3">
      <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">401</p>
      <h1 class="text-3xl font-bold">認証が必要です</h1>
      <RouterLink to="/auth" class="text-sm text-gray-600 underline underline-offset-4"
        >ログインへ進む</RouterLink
      >
    </div>
  </main>
</template>
