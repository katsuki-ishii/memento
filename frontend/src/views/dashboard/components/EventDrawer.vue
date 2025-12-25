<!--
  イベントドロワーコンポーネント
  選択された週のイベント一覧を表示します
  イベントの追加・編集・削除が可能です（現在はプレースホルダ）
-->
<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">イベント</h2>
      <!-- イベント追加ボタン -->
      <button
        class="rounded-md bg-gray-900 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-gray-800"
      >
        追加
      </button>
    </div>
    <p class="mt-2 text-sm text-gray-600">イベント一覧は今後APIと接続して表示します。</p>
    <!-- イベント一覧（現在はプレースホルダ） -->
    <div class="mt-3 space-y-2 text-sm text-gray-700">
      <div class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
        まだイベントがありません。
      </div>
    </div>
  </div>
</template>
