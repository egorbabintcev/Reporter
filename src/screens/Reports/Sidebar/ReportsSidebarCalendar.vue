<template>
  <a-calendar
  v-model:value="selectedDate"
  @panel-change="selectedPanel = $event"
  class="reports-sidebar-calendar"
  :fullscreen="false">
    <template #dateCellRender="{ current }">
      <a-badge
      class="reports-sidebar-calendar__badge"
      :status="
        reports.some(report => current.isSame(report.date, 'day'))
          ? 'success'
          : null
      "/>
    </template>
  </a-calendar>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    watch,
  } from 'vue';
  import {
    useRouter,
    useRoute,
  } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import dayjs, { Dayjs } from 'dayjs';

  import useReportApi from '@/core/api/report';
  import useStatsApi from '@/core/api/stats';

  import useReportStore from '@/core/store/report';
  import useStatsStore from '@/core/store/stats';

  export default defineComponent({
    name: 'ReportsSidebarCalendar',
    setup() {
      const router = useRouter();
      const route = useRoute();
      const reportApi = useReportApi();
      const statsApi = useStatsApi();

      const calendarReportStore = useReportStore('report/calendar');
      const calendarReportStoreRefs = storeToRefs((calendarReportStore));
      const reportStore = useReportStore();
      const reportStoreRefs = storeToRefs(reportStore);

      const statsStore = useStatsStore();

      const selectedDate = ref<Dayjs>(dayjs());
      const selectedPanel = ref<Dayjs>(selectedDate.value);

      async function fetchReportsForDay(date: Dayjs) {
        const reports = await reportApi.readReports({
          date_from: date.startOf('day').unix(),
          date_to: date.endOf('day').unix(),
        });

        if (reports.length > 0) {
          reportStore.setReport(reports[0]);

          await router.push({
            query: {
              ...route.query,
              id: reports[0].id,
            },
          });
        } else {
          reportStore.setReport(null);

          await router.push({
            query: {
              ...route.query,
              id: undefined,
            },
          });
        }
      }

      async function fetchReportsForMonth(date: Dayjs) {
        const reports = await reportApi.readReports({
          date_from: date.startOf('month').unix(),
          date_to: date.endOf('month').unix(),
        });

        calendarReportStore.setReports(reports);
      }

      async function fetchStatsForMonth(date: Dayjs) {
        const stats = await statsApi.readStats({
          from_date: date.startOf('month').unix(),
          to_date: date.endOf('month').unix(),
        });

        statsStore.setStats(stats);
      }

      watch(
        selectedDate,
        () => {
          fetchReportsForDay(selectedDate.value);

          router.push({
            query: {
              ...route.query,
              date: selectedDate.value.toISOString(),
            },
          });
        },
        {
          immediate: true,
        },
      );

      watch(
        selectedPanel,
        () => {
          fetchReportsForMonth(selectedPanel.value);
          fetchStatsForMonth(selectedPanel.value);
        },
        {
          immediate: true,
        },
      );

      watch(
        reportStoreRefs.report,
        (value, oldValue) => {
          if ((!!value && !oldValue) || (!!oldValue && !value)) {
            fetchReportsForMonth(selectedPanel.value);
          }

          fetchStatsForMonth(selectedPanel.value);
        },
      );

      return {
        selectedDate,
        selectedPanel,
        reports: calendarReportStoreRefs.reports,
      };
    },
  });
</script>

<style lang="scss">
  .reports-sidebar-calendar {
    border: 1px solid rgba(0 0 0 / 14%);
    border-radius: 2px;

    .ant-picker-calendar-header {
      justify-content: flex-start;
    }

    .ant-picker-calendar-date-content {
      line-height: 0 !important;

      height: 0 !important;
    }
  }

  .reports-sidebar-calendar__badge {
    position: absolute;
    top: -2px;
    right: -12px;
  }
</style>
