<template>
  <a-calendar
  v-model="currentDate"
  @panel-change="selectedPanel = $event">
    <template #dateCellRender="{current}">
      <div
      class="reports-date-cell-content"
      :class="{
        'reports-date-cell-content--disabled': current.month() !== selectedPanel.month()
      }">
        <p
        v-if="getReportForDate(current)"
        @click="goToReportHandler(getReportForDate(current)?.id)"
        class="reports-date-cell__text">
          {{ getReportTimeForDate(current) }}

          <form-outlined/>
        </p>

        <p
        v-else
        @click="createReportHandler(current)"
        class="reports-date-cell__text reports-date-cell__text--neutral">
          Добавить отчет

          <plus-outlined/>
        </p>
      </div>
    </template>
  </a-calendar>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { FormOutlined, PlusOutlined } from '@ant-design/icons-vue';

  import { getDateFromTimeString, getTimeStringFromDate } from '@/core/utils/time';
  import useReportStore from '@/core/store/report';
  import { Report } from '@/core/domain/report';
  import { TimeString } from '@/shared-kernel';
  import { useRouter } from 'vue-router';
  import useReportApi from '@/core/api/report';

  export default defineComponent({
    name: 'ReportsCalendar',
    components: {
      FormOutlined,
      PlusOutlined,
    },
    setup() {
      const currentDate = ref<Dayjs>(dayjs());
      const selectedPanel = ref<Dayjs>(dayjs());

      const reportStore = useReportStore();

      function getReportForDate(date: Dayjs) {
        return reportStore.reports.find((report) => dayjs(report.date).isSame(date, 'day'));
      }

      function getReportTimeForDate(date: Dayjs): TimeString {
        const report = getReportForDate(date);

        if (report) {
          return `${getTimeStringFromDate(new Date(report.startTime))}-${getTimeStringFromDate(new Date(report.endTime))}`;
        }

        return '';
      }

      const router = useRouter();

      async function goToReportHandler(id: Report['id']) {
        await router.push({
          name: 'reports-editor',
          params: { id },
        });
      }

      const reportApi = useReportApi();

      async function createReportHandler(date: Dayjs) {
        const report = await reportApi.createReport({
          displayName: '',
          body: '',

          date: date.unix() * 1000,

          startTime: getDateFromTimeString('12:00').getTime(),
          endTime: getDateFromTimeString('21:00').getTime(),
          workTime: 0,
          breakTime: getDateFromTimeString('01:00').getTime(),
        });

        if (report) {
          await goToReportHandler(report.id);
        }
      }

      return {
        currentDate,
        selectedPanel,
        getReportForDate,
        getReportTimeForDate,
        goToReportHandler,
        createReportHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
