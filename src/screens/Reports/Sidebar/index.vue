<template>
  <div
  class="reports-sidebar"
  :class="{
    'reports-sidebar--rightside': sidebarPosition === 'right',
  }">
    <div class="section-24">
      <reports-sidebar-calendar/>

      <reports-sidebar-stats/>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';

  import usePreferencesStore from '@/store/preferences';

  import ReportsSidebarCalendar from './ReportsSidebarCalendar.vue';
  import ReportsSidebarStats from './ReportsSidebarStats.vue';

  export default defineComponent({
    name: 'ReportsSidebar',
    components: {
      ReportsSidebarCalendar,
      ReportsSidebarStats,
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
  .reports-sidebar {
    display: flex;
    flex-flow: column nowrap;
    flex: 0 0 332px;

    padding: 16px;

    border-right: 1px solid rgba(0 0 0 / 14%);
  }

  .reports-sidebar--rightside {
    border-left: 1px solid rgba(0 0 0 / 14%);
  }
</style>
