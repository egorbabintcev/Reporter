<template>
  <div
  class="
    flex
    flex-row
    border-b
    border-b-gray-200
    border-solid
  "
  :class="{
    'border-b-0': index === maxIndex
  }">
    <div
    class="
      flex
      flex-row
      items-center
      flex-1
      px-3
      py-1.5
      overflow-hidden
      min-w-0
    ">
      <p>
        {{ report.title || `Отчет о работе за ${getDateStringFromDate(new Date(report.date))}` }}
      </p>
    </div>

    <div
    class="
      flex
      flex-row
      items-center
      flex-initial
      w-40
      px-3
      py-1.5
      overflow-hidden
      min-w-0
    ">
      <p>
        {{ getTimeStringFromDate(new Date(report.startTime)) }}
      </p>
    </div>

    <div
    class="
      flex
      flex-row
      items-center
      flex-initial
      w-40
      px-3
      py-1.5
      overflow-hidden
      min-w-0
    ">
      <p>
        {{ getTimeStringFromDate(new Date(report.endTime)) }}
      </p>
    </div>

    <div
    class="
      flex
      flex-row
      items-center
      flex-initial
      w-40
      px-3
      py-1.5
      overflow-hidden
      min-w-0
    ">
      <p>
        {{ getTimeStringFromDate(new Date(report.breakTime)) }}
      </p>
    </div>

    <div class="w-32 flex-shrink"/>

    <div
    class="
      flex
      flex-row
      items-center
      flex-initial
      w-72
      px-3
      py-1.5
      overflow-hidden
      min-w-0
    ">
      <div class="flex flex-row items-center gap-3">
        <button
        @click="editReportHandler"
        class="
          px-4
          py-2
          rounded
          border
          border-solid
          border-gra-200
          hover:bg-gray-200
          focus:active:border-gray-400
        ">
          Редактировать
        </button>

        <button
        @click="deleteReportHandler"
        class="
          px-4
          py-2
          rounded
          border
          border-red-200
          border-solid
          hover:bg-red-200
          focus:active:border-red-300
        ">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import { Report } from '@/core/domain/report';

  import { getTimeStringFromDate, getDateStringFromDate } from '@/core/utils/time';
  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';

  export default defineComponent({
    name: 'ReportsTableItem',
    props: {
      report: {
        type: Object as PropType<Report>,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const reportApi = useReportApi();
      const reportStore = useReportStore();

      const router = useRouter();

      const maxIndex = computed(() => reportStore.reports.length - 1);

      async function editReportHandler() {
        await router.push({
          query: {
            id: props.report.id,
            action: 'edit',
          },
        });
      }

      async function deleteReportHandler() {
        await reportApi.deleteReport(props.report.id);

        const reports = await reportApi.readReports();
        reportStore.setReports(reports);
      }

      return {
        maxIndex,
        getTimeStringFromDate,
        getDateStringFromDate,

        editReportHandler,
        deleteReportHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
