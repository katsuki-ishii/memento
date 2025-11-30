<template>
  <div class="grid grid-cols-12 gap-1 text-[10px]">
    <template v-for="row in 6" :key="row">
      <template v-for="col in 26" :key="`${row}-${col}`">
        <div class="h-4 w-4 rounded-sm bg-gray-200"></div>
      </template>
    </template>
  </div>
</template>
