<template>
  <div
  :class="{
    'w-72': !isCompactMode,
    'w-auto': isCompactMode,
  }"
  class="bg-blue-900 py-6 relative">
    <div class="flex flex-col gap-6">
      <div class="flex flex-row gap-2 items-center px-3">
        <Icon
        icon="description"
        class="w-[2.4rem] h-[2.4rem] text-white text-[2.4rem]"/>

        <div
        v-if="!isCompactMode"
        class="flex flex-col">
          <p class="text-xl text-white">
            Reporter
          </p>

          <p class="text-xs text-white">
            Управление отчетами
          </p>
        </div>
      </div>

      <div class="flex flex-col pl-3 gap-2">
        <div
        v-for="(section, index) in sectionList"
        :key="index"
        :class="{
          'opacity-50 pointer-events-none': section.isDisabled,
          'bg-blue-400/25': section.isActive,
          'hover:bg-blue-400/10': !section.isActive,
        }"
        class="flex flex-row gap-2.5 p-2 rounded-l-xl cursor-pointer">
          <Icon
          :icon="section.icon"
          class="w-[1.5rem] h-[1.5rem] text-white text-[1.5rem]"/>

          <p
          v-if="!isCompactMode"
          class="text-lg text-white">
            {{ section.text }}
          </p>
        </div>
      </div>
    </div>

    <button
    @click="isCompactMode = !isCompactMode"
    class="flex flex-row items-center justify-center w-[2.5rem] h-[2.5rem] bg-white rounded-full border border-solid border-blue-900 absolute top-1/2 left-full -translate-x-1/2">
      <Icon
      :icon="
        isCompactMode
          ? 'chevron_right'
          : 'chevron_left'
      "
      class="w-[2rem] h-[2rem] text-blue-900 text-[2rem]"/>
    </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';

  import Icon from '@/components/Icon.vue';

  export default defineComponent({
    name: 'TheSidebar',
    components: {
      Icon,
    },
    setup() {
      type Section = {
        text: string
        icon: string
        isDisabled?: boolean
        isActive?: boolean
      }

      const sectionList: Array<Section> = [
        {
          text: 'Главная',
          icon: 'home',
          isActive: true,
        },
        {
          text: 'Статистика',
          icon: 'poll',
          isDisabled: true,
        },
        {
          text: 'Настройки',
          icon: 'settings',
          isDisabled: true,
        },
        {
          text: 'Профиль',
          icon: 'person',
          isDisabled: true,
        },
      ];

      const isCompactMode = ref<boolean>(Boolean(localStorage.getItem('reporter_sidebar_compact_mode')));

      watch(isCompactMode, (value) => {
        localStorage.setItem('reporter_sidebar_compact_mode', String(value));
      });

      return {
        sectionList,
        isCompactMode,
      };
    },
  });
</script>

<style lang="scss">

</style>
