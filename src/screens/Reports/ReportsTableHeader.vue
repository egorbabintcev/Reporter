<template>
  <div>
    <div
    class="
      flex
      flex-row
      border-b
      border-b-gray-300
      border-solid
    ">
      <div
      class="
        flex
        flex-row
        items-center
        flex-1
        px-3
        py-1.5
        overflow-hidden
        min-w-0
      ">
        <p
        class="
          text-base
          text-gray-500
          font-semibold
          truncate
       ">
          Название
        </p>
      </div>

      <div
      class="
        flex
        flex-row
        items-center
        flex-initial
        w-40
        px-3
        py-1.5
        overflow-hidden
        min-w-0
      ">
        <p
        class="
          text-base
          text-gray-500
          font-semibold
          truncate
       ">
          Начало работы
        </p>
      </div>

      <div
      class="
        flex
        flex-row
        items-center
        flex-initial
        w-40
        px-3
        py-1.5
        overflow-hidden
        min-w-0
      ">
        <p
        class="
          text-base
          text-gray-500
          font-semibold
          truncate
       ">
          Конец работы
        </p>
      </div>

      <div
      class="
        flex
        flex-row
        items-center
        flex-initial
        w-40
        px-3
        py-1.5
        overflow-hidden
        min-w-0
      ">
        <p
        class="
          text-base
          text-gray-500
          font-semibold
          truncate
       ">
          Время перерыва
        </p>
      </div>

      <div class="w-32 flex-shrink"/>

      <div
      class="
        flex
        flex-row
        items-center
        flex-initial
        w-72
        px-3
        py-1.5
        overflow-hidden
        min-w-0
      ">
        <p
        class="
          text-base
          text-gray-500
          font-semibold
          truncate
       ">
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
  .reports-table-header-line {
    @apply flex;
    @apply flex-row;
  }
</style>
