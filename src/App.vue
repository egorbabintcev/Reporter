<template>
  <div class="app">
    <div class="app-container">
      <TheMenu
      v-if="showMenu"/>

      <router-view v-slot="{ Component }">
        <transition mode="out-in" name="fade">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from 'vue-router';

  import TheMenu from '@/components/TheMenu/index.vue';

  export default defineComponent({
    name: 'App',
    components: {
      TheMenu,
    },
    setup() {
      const route = useRoute();

      const showMenu = computed(() => route.meta.authRequired);

      return {
        showMenu,
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

  .app-container {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    overflow: hidden;
  }

  .fade-animation-enter-active,
  .fade-animation-leave-active {
    transition: opacity 0.2s;
  }

  .fade-animation-enter-from,
  .fade-animation-leave-to {
    opacity: 0;
  }
</style>
