<template>
  <div class="flex flex-row gap-2 items-center mb-auto">
    <IconComponent
    icon="description"
    class="w-[3rem] h-[3rem] text-white text-[3rem]"/>

    <div class="flex flex-col">
      <p class="text-2xl text-white">
        Reporter
      </p>

      <p class="text-sm text-white">
        Управление отчетами
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import IconComponent from '@/components/Icon.vue';

  export default defineComponent({
    name: 'TheSidebarProductInfo',
    components: {
      IconComponent,
    },
  });
</script>

<style lang="scss">

</style>
