<template>
  <main class="min-h-screen bg-white text-gray-900">
    <div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center">
      <div class="flex-1 space-y-4">
        <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">Memento</p>
        <h1 class="text-4xl font-bold tracking-tight md:text-5xl">
          あなたの時間を、週で見える化する。
        </h1>
        <p class="text-lg text-gray-600 md:text-xl">
          週単位のライフグリッドで現在地を確認し、これからの時間をデザインしましょう。
        </p>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            to="/auth/start"
            class="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition hover:bg-gray-800"
          >
            サインアップ / ログイン
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="rounded-md border border-gray-300 px-4 py-2 text-gray-900 transition hover:border-gray-400"
          >
            ダッシュボードを見る
          </RouterLink>
        </div>
      </div>
      <div class="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <p class="mb-4 text-sm font-semibold text-gray-500">ライフグリッド（サンプル）</p>
        <div class="grid grid-cols-12 gap-1 text-[10px] text-gray-500">
          <template v-for="row in 6" :key="row">
            <template v-for="col in 13" :key="`${row}-${col}`">
              <div class="h-4 w-4 rounded-sm bg-gray-200"></div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>
