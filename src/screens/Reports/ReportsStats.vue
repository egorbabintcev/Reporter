<template>
  <div class="flex gap-3 rounded-xl p-6 max-w-screen-lg shadow">
    <div class="flex flex-col gap-1 w-1/3">
      <p class="text-lg text-gray-400">
        Отработано за этот месяц:
      </p>

      <h3 class="text-3xl text-gray-700 font-semibold">
        165 часов

        <span class="text-base text-green-500">(+3.25%)</span>
      </h3>
    </div>

    <div class="flex flex-col gap-1 w-1/3">
      <p class="text-lg text-gray-400">
        В среднем за день:
      </p>

      <h3 class="text-3xl text-gray-700 font-semibold">
        8 часов

        <span class="text-base text-green-500">(+1.05%)</span>
      </h3>
    </div>

    <div class="flex flex-col gap-1 w-1/3">
      <p class="text-lg text-gray-400">
        В среднем отдыха:
      </p>

      <h3 class="text-3xl text-gray-700 font-semibold">
        1 час

        <span class="text-base text-red-500">(-5%)</span>
      </h3>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ReportsStats',
  });
</script>

<style lang="scss">

</style>
