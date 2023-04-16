<template>
  <div class="reports-sidebar">
    <div class="section-24">
      <reports-sidebar-calendar/>

      <reports-sidebar-stats/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import ReportsSidebarCalendar from './ReportsSidebarCalendar.vue';
  import ReportsSidebarStats from './ReportsSidebarStats.vue';

  export default defineComponent({
    name: 'ReportsSidebar',
    components: {
      ReportsSidebarCalendar,
      ReportsSidebarStats,
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
</style>
