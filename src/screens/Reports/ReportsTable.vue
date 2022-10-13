<template>
  <div
  v-if="reports.length"
  class="
    max-w-screen-xl
    flex
    flex-col
    flex-nowrap
    flex-grow
    border
    border-solid
    border-gray-300
    rounded
  ">
    <ReportsTableHeader/>

    <div class="flex flex-col">
      <ReportsTableItem
      v-for="(report, index) in reports"
      :key="index"
      :index="index"
      :report="report"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';

  import useReportStore from '@/core/store/report';

  import ReportsTableHeader from '@/screens/Reports/ReportsTableHeader.vue';
  import ReportsTableItem from '@/screens/Reports/ReportsTableItem.vue';

  export default defineComponent({
    name: 'ReportsTable',
    components: {
      ReportsTableHeader,
      ReportsTableItem,
    },
    setup() {
      const reportStore = useReportStore();
      const reportStoreRefs = storeToRefs(reportStore);

      return {
        reports: reportStoreRefs.reports,
      };
    },
  });
</script>

<style lang="scss">

</style>
