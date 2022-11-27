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
        px-3
        py-1.5
        overflow-hidden
        w-3/12
        min-w-0
      ">
        <p
        class="
          text-base
          text-gray-500
          font-semibold
          truncate
       ">
          Дата
        </p>
      </div>

      <div
      class="
        flex
        flex-row
        items-center
        px-3
        py-1.5
        overflow-hidden
        w-2/12
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
        px-3
        py-1.5
        overflow-hidden
        w-2/12
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
        px-3
        py-1.5
        overflow-hidden
        w-2/12
        min-w-0
      ">
        <p
        class="
          text-base
          text-gray-500
          font-semibold
          truncate
       ">
          Перерыв
        </p>
      </div>

      <div
      class="
        flex
        flex-row
        items-center
        flex-initial
        px-3
        py-1.5
        overflow-hidden
        w-3/12
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

<script lang="ts">
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
