<template>
  <div class="section-16">
    <CalendarComponent
    v-model:modelValue="selectedDate"
    @panel-change="selectedPanel = $event"
    :events="events"/>

    <el-button
    @click="generateAndCopyMonthReportHandler">
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
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    ref,
    watch,
    onBeforeMount,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import dayjs, { Dayjs } from 'dayjs';

  import useReportsStore from '@/store/reports';
  import useStatsStore from '@/store/stats';
  import useReportsScreenStore from '@/screens/Reports/useReportsScreenStore';
  import useLaborCalendarStore from '@/store/labor-calendar';

  import CalendarComponent from '@/components/Calendar.vue';
  import { GSymbol } from 'vue-material-symbols';
  import { getTimeStringFromDate } from '@/utils/time';
  import { ElMessage } from 'element-plus';
  import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

  export default defineComponent({
    name: 'ReportsSidebarCalendar',
    components: {
      GSymbol,
      CalendarComponent,
    },
    setup() {
      const router = useRouter();

      const monthReportsStore = useReportsStore('month-reports');
      const monthReportsStoreRefs = storeToRefs(monthReportsStore);

      const monthStatsStore = useStatsStore('month-stats');

      const monthLaborCalendarStore = useLaborCalendarStore('month-labor-calendar');
      const currentLaborCalendarStore = useLaborCalendarStore('current-labor-calendar');

      const reportsScreenStore = useReportsScreenStore();
      const reportsScreenStoreRefs = storeToRefs(reportsScreenStore);

      const selectedDate = computed<Dayjs>({
        get(): Dayjs {
          return reportsScreenStoreRefs.selectedDate.value;
        },
        set(value: Dayjs) {
          reportsScreenStore.$patch({
            selectedDate: value,
          });
        },
      });
      const selectedPanel = ref<Dayjs>(reportsScreenStore.selectedDate);

      const events = computed(() => {
        return monthReportsStoreRefs.reports.value.map((report) => report.date * 1000);
      });

      function setSelectedDateReportToDayReport() {
        const selectedDateReport = monthReportsStoreRefs.reports.value.find((item) => {
          return dayjs(item.date * 1000).isSame(selectedDate.value, 'day');
        });

        router.push({
          query: { report_id: selectedDateReport?.id ?? undefined },
        });
      }

      async function generateAndCopyMonthReportHandler() {
        let resultString = '';

        const startOfMonth = selectedDate.value.startOf('month');
        const endOfMonth = selectedDate.value.endOf('month');

        for (let cur = startOfMonth; cur.isSameOrBefore(endOfMonth, 'day'); cur = cur.add(1, 'day')) {
          const report = monthReportsStore.reports.find((item) => cur.isSame(item.date * 1000, 'date'));

          if (report) {
            const startTimeString = getTimeStringFromDate(new Date(report.start_time * 1000));
            const endTimeString = getTimeStringFromDate(new Date(report.end_time * 1000));
            const breakTimeString = getTimeStringFromDate(new Date(report.break_time * 1000));
            resultString += `${startTimeString}\t${endTimeString}\t${breakTimeString}\n`;
          } else {
            resultString += '\n';
          }
        }

        await navigator.clipboard.writeText(resultString);

        ElMessage.success('Скопировано в буфер обмена');
      }

      onBeforeMount(() => {
        const today = dayjs();
        const endOfSelectedMonth = selectedDate.value.endOf('month');

        if (today.isBefore(endOfSelectedMonth, 'day')) {
          currentLaborCalendarStore.fetchLaborCalendar(selectedDate.value.startOf('month'), today);
        }

        monthLaborCalendarStore.fetchLaborCalendarForPeriod(selectedDate.value, 'month');
        monthStatsStore.fetchStatsForPeriod(selectedDate.value, 'month');
        monthReportsStore.fetchReportListForTimePeriod(selectedDate.value, 'month')
          .then(setSelectedDateReportToDayReport);
      });

      watch(selectedDate, setSelectedDateReportToDayReport);

      watch(selectedPanel, () => {
        const today = dayjs();
        const startOfSelectedMonth = selectedDate.value.startOf('month');
        const endOfSelectedMonth = selectedDate.value.endOf('month');

        if (today.isBefore(endOfSelectedMonth, 'day') && !today.isBefore(startOfSelectedMonth, 'day')) {
          currentLaborCalendarStore.fetchLaborCalendar(selectedDate.value.startOf('month'), today);
        } else {
          currentLaborCalendarStore.$reset();
        }

        monthLaborCalendarStore.fetchLaborCalendarForPeriod(selectedDate.value, 'month');
        monthStatsStore.fetchStatsForPeriod(selectedDate.value, 'month');
        monthReportsStore.fetchReportListForTimePeriod(selectedDate.value, 'month')
          .then(setSelectedDateReportToDayReport);
      });

      return {
        selectedDate,
        selectedPanel,
        events,

        generateAndCopyMonthReportHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
