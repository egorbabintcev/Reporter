<template>
  <div
  class="main-table-line"
  :class="{
    'border-bottom-0': index === maxIndex
  }">
    <div class="main-table-el reports-table-el__title">
      <p>
        {{ report.title }}
      </p>
    </div>

    <div class="main-table-el">
      <p>
        {{ getTimeStringFromDate(new Date(report.startTime)) }}
      </p>
    </div>

    <div class="main-table-el">
      <p>
        {{ getTimeStringFromDate(new Date(report.endTime)) }}
      </p>
    </div>

    <div class="main-table-el">
      <p>
        {{ getTimeStringFromDate(new Date(report.breakTime)) }}
      </p>
    </div>

    <div class="main-table-el">
      <div class="main-row-12">
        <button
        disabled>
          Редактировать
        </button>

        <button
        disabled>
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';

  import { getTimeStringFromDate } from '@/core/utils/time';
  import { Report } from '@/core/domain/report';
  import useReportService from '@/core/service/report';

  export default defineComponent({
    name: 'ReportsTableItem',
    props: {
      report: {
        type: Object as PropType<Report>,
        required: true,
      },
      index: {
        type: Object as PropType<number>,
        required: true,
      },
    },
    setup() {
      const reportService = useReportService();

      const maxIndex = computed(() => reportService.reports.value.length - 1);

      return {
        maxIndex,
        getTimeStringFromDate,
      };
    },
  });
</script>

<style lang="scss">

</style>
