<!--
  サマリーパネルコンポーネント
  ライフグリッドの進捗状況をサマリー表示します
  記録済み週数、残り寿命、残り割合などを表示します（現在はプレースホルダ）
-->
<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-900">進捗サマリー</h2>
    <p class="text-sm text-gray-600">今後 API から取得した指標を表示します。</p>
    <!-- サマリー情報のリスト -->
    <ul class="mt-3 space-y-1 text-sm text-gray-700">
      <li>記録済み週: -- 週</li>
      <li>残り寿命: -- 週 / -- 日</li>
      <li>残り割合: -- %</li>
    </ul>
  </div>
</template>
