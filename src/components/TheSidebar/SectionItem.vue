<template>
  <div
  class="flex flex-row items-center gap-4 py-2 rounded-l-xl cursor-pointer"
  :class="{
    'opacity-50 pointer-events-none': section.isDisabled,
    [activeSectionClass]: section.isActive,
  }">
    <IconComponent
    class="w-[2.4rem] h-[2.4rem] text-white text-[2.4rem]"
    :icon="section.icon"/>

    <p class="text-xl text-white">
      {{ section.text }}
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import IconComponent from '@/components/Icon.vue';

  export type Section = {
    text: string
    icon: string
    isDisabled?: boolean
    isActive?: boolean
  }

  export default defineComponent({
    name: 'TheSidebarSectionItem',
    components: {
      IconComponent,
    },
    props: {
      section: {
        type: Object as PropType<Section>,
        required: true,
      },
    },
    setup() {
      const activeSectionClass = `
        before:block
        before:h-8
        before:w-3
        before:bg-white
        before:rounded-tr-lg
        before:rounded-br-lg
        before:absolute
        before:left-0
      `;

      return {
        activeSectionClass,
      };
    },
  });
</script>

<style lang="scss">

</style>
