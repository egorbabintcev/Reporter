<template>
  <div class="app">
    <div class="app-container">
      <TheMenu
      v-if="showMenu"/>

      <router-view v-slot="{ Component }">
        <transition
        mode="out-in"
        name="fade">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>

    <div
    class="app-widgets flex--dir--horizontal flex--gap--8"
    :class="{
      'app-widgets--rightside flex--dir--horizontal-reversed': showMenu && sidebarPosition === 'right'
    }">
      <bug-report-widget/>

      <preferences-widget
      v-if="showMenu"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';

  import usePreferencesStore from '@/store/preferences';

  import TheMenu from '@/components/TheMenu/index.vue';
  import BugReportWidget from '@/components/BugReportWidget.vue';
  import PreferencesWidget from '@/components/PreferencesWidget.vue';

  export default defineComponent({
    name: 'App',
    components: {
      TheMenu,
      BugReportWidget,
      PreferencesWidget,
    },
    setup() {
      const route = useRoute();

      const showMenu = computed(() => route.meta.authRequired);

      const preferencesStore = usePreferencesStore();
      const preferencesStoreRefs = storeToRefs(preferencesStore);

      const sidebarPosition = computed(() => {
        return preferencesStoreRefs.preferences.value.sidebarPosition;
      });

      return {
        showMenu,
        sidebarPosition,
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

  .app-widgets {
    position: fixed;
    bottom: 20px;
    left: 20px;
  }

  .app-widgets--rightside {
    right: 20px;
    left: unset;
  }
</style>
