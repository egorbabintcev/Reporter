<template>
  <div class="app">
    <div class="flex flex-row flex-grow">
      <TheSidebar/>

      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import TheSidebar from '@/components/TheSidebar.vue';

  export default defineComponent({
    name: 'App',
    components: {
      TheSidebar,
    },
  });
</script>

<style lang="scss">
  .app {
    display: flex;
    flex-flow: column nowrap;

    min-height: 100vh;
    overflow: hidden;
  }
</style>
