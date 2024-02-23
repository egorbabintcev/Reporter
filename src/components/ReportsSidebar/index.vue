<script lang="ts">
  import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import dayjs, { Dayjs } from 'dayjs';
  import { GSymbol } from 'vue-material-symbols';
  import { ElMessage } from 'element-plus';

  import CalendarComponent from '@/components/Calendar.vue';
  import HoursStatsCard from '@/components/HoursStatsCard/index.vue';

  import useReportsStore from '@/store/reports.ts';
  import { storeToRefs } from 'pinia';
  import useStatsStore from '@/store/stats.ts';
  import useLaborCalendarStore from '@/store/labor-calendar.ts';
  import { getTimeStringFromDate } from '@/utils/time.ts';

  export default defineComponent({
    name: 'ReportsSidebar',
    components: {
      CalendarComponent,
      HoursStatsCard,
      GSymbol,
    },
    setup() {
      const router = useRouter();

      const selectedDate = ref<Dayjs>(dayjs());

      const reportsStore = useReportsStore();
      const reportsStoreRefs = storeToRefs(reportsStore);

      const statsStore = useStatsStore();
      const statsStoreRefs = storeToRefs(statsStore);

      const laborCalendarStore = useLaborCalendarStore();
      const laborCalendarStoreRefs = storeToRefs(laborCalendarStore);
      const currentLaborCalendarStore = useLaborCalendarStore('current-labor-calendar');
      const currentLaborCalendarStoreRefs = storeToRefs(currentLaborCalendarStore);

      const events = computed<number[]>(() => {
        const reports = reportsStoreRefs.reports.value;

        return reports.map((report) => report.date * 1000);
      });

      const currentWorkedTime = computed<number>(() => {
        const stats = statsStoreRefs.stats.value;

        return stats?.hours_worked ?? 0;
      });

      const totalQuotaTime = computed<number>(() => {
        const laborCalendar = laborCalendarStoreRefs.laborCalendar.value;

        return (laborCalendar?.totalWorkingDays ?? 0) * 8 * 60 * 60;
      });

      const currentQuotaTime = computed<number>(() => {
        const laborCalendar = currentLaborCalendarStoreRefs.laborCalendar.value;

        return ((laborCalendar?.totalWorkingDays ?? 0) * 8 * 60 * 60) || totalQuotaTime.value;
      });

      async function updateMonthData() {
        await reportsStore.getReportsForTimePeriod(selectedDate.value, 'month');
        await statsStore.fetchStatsForPeriod(selectedDate.value, 'month');

        await laborCalendarStore.fetchLaborCalendarForPeriod(selectedDate.value, 'month');

        const today = dayjs();
        const isSameMonth = today.isSame(selectedDate.value, 'month');

        if (isSameMonth) {
          const endOfMonth = today.endOf('month');
          const isEndOfMonth = today.date() === endOfMonth.date();

          if (!isEndOfMonth) {
            await currentLaborCalendarStore.fetchLaborCalendar(today.startOf('month'), today);
          } else {
            currentLaborCalendarStore.$reset();
          }
        } else {
          currentLaborCalendarStore.$reset();
        }
      }

      function updateDayData() {
        const reportForSelectedDay = reportsStore.reports.find((report) => {
          return dayjs(report.date * 1000).isSame(selectedDate.value, 'date');
        });

        router.push({
          query: {
            report_id: reportForSelectedDay?.id,
            date: !reportForSelectedDay?.id
              ? selectedDate.value.toISOString()
              : undefined,
          },
        });
      }

      async function copyMonthReportHandler() {
        let resultString = '';

        const startOfMonth = selectedDate.value.startOf('month');
        const endOfMonth = selectedDate.value.endOf('month');

        for (let date = startOfMonth.date(); date <= endOfMonth.date(); date += 1) {
          const current = startOfMonth.set('date', date);
          const report = reportsStore.reports.find((item) => current.isSame(item.date * 1000, 'date'));

          resultString += `${current.format('DD.MM.YYYY')}\t`;

          if (report) {
            const startTimeString = getTimeStringFromDate(new Date(report.start_time * 1000));
            const endTimeString = getTimeStringFromDate(new Date(report.end_time * 1000));
            const breakTimeString = getTimeStringFromDate(new Date(report.break_time * 1000));
            resultString += `${startTimeString}\t${endTimeString}\t${breakTimeString}\n`;
          } else {
            resultString += '\t\t\n';
          }
        }

        await navigator.clipboard.writeText(resultString);

        ElMessage.success('Скопировано в буфер обмена');
      }

      reportsStore.$onAction((action) => {
        if (['createReport', 'updateReportTime', 'deleteReport'].includes(action.name)) {
          action.after(async () => {
            await updateMonthData();
            updateDayData();
          });
        }
      });

      onBeforeMount(async () => {
        await updateMonthData();
        updateDayData();
      });

      watch(selectedDate, async (newValue, oldValue) => {
        if (!newValue.isSame(oldValue, 'month')) {
          await updateMonthData();
        }

        updateDayData();
      });

      return {
        selectedDate,
        events,
        currentWorkedTime,
        totalQuotaTime,
        currentQuotaTime,

        copyMonthReportHandler,
      };
    },
  });
</script>

<template>
  <div class="reports-sidebar">
    <calendar-component
    v-model="selectedDate"
    :events="events"/>

    <el-button
    @click="copyMonthReportHandler">
      <template #icon>
        <el-icon size="18">
          <g-symbol
          fill
          :grade="-25"
          icon="content_copy"
          type="outlined"/>
        </el-icon>
      </template>

      Скопировать отчет за месяц
    </el-button>

    <hours-stats-card
    :currentTime="currentWorkedTime"
    :quotaTime="currentQuotaTime"
    :totalQuotaTime="totalQuotaTime"/>
  </div>
</template>

<style lang="scss">
  .reports-sidebar {
    display: flex;
    flex-flow: column nowrap;
    gap: 16px;

    width: 320px;
    padding: 16px;

    border-right: 1px solid rgba(0 0 0 / 0.14);
  }
</style>
