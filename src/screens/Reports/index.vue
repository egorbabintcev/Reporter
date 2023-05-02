<template>
  <div
  class="reports-screen flex--dir--horizontal flex--grow"
  :class="{
    'flex--dir--horizontal-reversed': sidebarPosition === 'right'
  }">
    <reports-sidebar/>

    <reports-editor/>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';

  import usePreferencesStore from '@/store/preferences';

  import ReportsEditor from './Editor/index.vue';
  import ReportsSidebar from './Sidebar/index.vue';

  export default defineComponent({
    name: 'ReportsScreen',
    components: {
      ReportsEditor,
      ReportsSidebar,
    },
    setup() {
      const preferencesStore = usePreferencesStore();
      const preferencesStoreRefs = storeToRefs(preferencesStore);

      const sidebarPosition = computed(() => {
        return preferencesStoreRefs.preferences.value.sidebarPosition;
      });

      return {
        sidebarPosition,
      };
    },
  });
</script>

<style lang="scss">

</style>
