<template>
  <div class="app bg-slate-700">
    <div class="flex flex-row flex-grow overflow-hidden">
      <TheSidebar
      v-if="showSidebar"/>

      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from 'vue-router';

  import TheSidebar from '@/components/TheSidebar/index.vue';

  export default defineComponent({
    name: 'App',
    components: {
      TheSidebar,
    },
    setup() {
      const route = useRoute();

      const showSidebar = computed(() => route.meta.authRequired);

      return {
        showSidebar,
      };
    },
  });
</script>

<style lang="scss">
  .app {
    display: flex;
    flex-flow: column nowrap;

    height: 100vh;
    overflow: hidden;
  }
</style>
