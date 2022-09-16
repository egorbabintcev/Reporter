<template>
  <div class="main-table">
    <ReportsTableHeader/>

    <div class="main-table-body">
      <ReportsTableItem
      v-for="(report, index) in reports"
      :key="index"
      :index="index"
      :report="report"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount } from 'vue';

  import useReportService from '@/core/service/report';
  import ReportsTableHeader from '@/screens/Reports/ReportsTableHeader.vue';
  import ReportsTableItem from '@/screens/Reports/ReportsTableItem.vue';

  export default defineComponent({
    name: 'ReportsTable',
    components: {
      ReportsTableHeader,
      ReportsTableItem,
    },
    setup() {
      const reportService = useReportService();

      onBeforeMount(() => {
        reportService.readReports();
      });

      return {
        reports: reportService.reports,
      };
    },
  });
</script>

<style lang="scss">
  .reports-table-el__title {
    min-width: 320px;
  }
</style>
