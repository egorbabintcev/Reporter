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
        @click="editReportHandler">
          Редактировать
        </button>

        <button
        @click="deleteReportHandler">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import { getTimeStringFromDate } from '@/core/utils/time';
  import { Report } from '@/core/domain/report';
  import useReportService from '@/core/service/report';
  import useShowPopups from '@/screens/Reports/useShowPopups';

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
      const reportService = useReportService();
      const {
        setShowPopup,
      } = useShowPopups();
      const router = useRouter();

      const maxIndex = computed(() => reportService.reports.value.length - 1);

      async function editReportHandler() {
        await router.push({
          params: {
            id: props.report.id,
            action: 'edit',
          },
        });
        setShowPopup('createReportPopup', true);
      }

      function deleteReportHandler() {
        reportService.deleteReport(props.report.id);
      }

      return {
        maxIndex,
        getTimeStringFromDate,

        editReportHandler,
        deleteReportHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
