<template>
  <div class="flex flex-col gap-1.5">
    <h1 class="text-xl font-bold text-gray-800">
      Добро пожаловать!
    </h1>

    <h2 class="text-lg text-gray-600">
      Здесь ты можешь просматривать и редактировать свои отчеты (а в будущем статистику и прочие плюшки 😊)
    </h2>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ReportsHeader',
  });
</script>

<style lang="scss">

</style>
