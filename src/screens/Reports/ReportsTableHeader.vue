<template>
  <div class="main-table-head">
    <div class="main-table-line main-table-line--gray">
      <div class="main-table-el reports-table-el__title">
        <p class="main-table-el__text main-table-el__text--gray fw-semibold">
          Название
        </p>
      </div>

      <div class="main-table-el">
        <p class="main-table-el__text main-table-el__text--gray fw-semibold">
          Начало работы
        </p>
      </div>

      <div class="main-table-el">
        <p class="main-table-el__text main-table-el__text--gray fw-semibold">
          Конец работы
        </p>
      </div>

      <div class="main-table-el">
        <p class="main-table-el__text main-table-el__text--gray fw-semibold">
          Перерыв
        </p>
      </div>

      <div class="main-table-el">
        <p class="main-table-el__text main-table-el__text--gray fw-semibold">
          Действия
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ReportsTableHeader',
  });
</script>

<style lang="scss">

</style>
