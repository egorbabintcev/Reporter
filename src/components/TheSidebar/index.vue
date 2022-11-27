<template>
  <div class="w-80 min-w-[16rem] py-10 pl-10 relative">
    <div class="h-full flex flex-col gap-6">
      <ProductInfo/>

      <div
      class="
        flex
        flex-col
        gap-2
        flex-[0_0_50%]
      ">
        <SectionItem
        v-for="(section, index) in sectionList"
        :key="index"
        :section="section"/>
      </div>

      <ProfileActions/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import ProductInfo from './ProductInfo.vue';
  import SectionItem, { Section } from './SectionItem.vue';
  import ProfileActions from './ProfileActions.vue';

  export default defineComponent({
    name: 'TheSidebar',
    components: {
      ProductInfo,
      SectionItem,
      ProfileActions,
    },
    setup() {
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

      return {
        sectionList,
      };
    },
  });
</script>

<style lang="scss">

</style>
