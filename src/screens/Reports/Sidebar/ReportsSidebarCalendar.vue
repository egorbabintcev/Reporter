<template>
  <CalendarComponent
  v-model:modelValue="selectedDate"
  @panel-change="selectedPanel = $event"
  :events="events"/>
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

  export default defineComponent({
    name: 'ReportsSidebarCalendar',
    components: { CalendarComponent },
    setup() {
      const router = useRouter();

      const monthReportsStore = useReportsStore('month-reports');
      const monthReportsStoreRefs = storeToRefs(monthReportsStore);

      const monthStatsStore = useStatsStore('month-stats');

      const monthLaborCalendarStore = useLaborCalendarStore('month-labor-calendar');

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

      onBeforeMount(() => {
        monthLaborCalendarStore.fetchLaborCalendarForPeriod(selectedDate.value, 'month');
        monthStatsStore.fetchStatsForPeriod(selectedDate.value, 'month');
        monthReportsStore.fetchReportListForTimePeriod(selectedDate.value, 'month')
          .then(setSelectedDateReportToDayReport);
      });

      watch(selectedDate, setSelectedDateReportToDayReport);

      watch(selectedPanel, () => {
        monthLaborCalendarStore.fetchLaborCalendarForPeriod(selectedDate.value, 'month');
        monthStatsStore.fetchStatsForPeriod(selectedDate.value, 'month');
        monthReportsStore.fetchReportListForTimePeriod(selectedDate.value, 'month')
          .then(setSelectedDateReportToDayReport);
      });

      return {
        selectedDate,
        selectedPanel,
        events,
      };
    },
  });
</script>

<style lang="scss">

</style>
