<script lang="ts">
  import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import dayjs, { Dayjs } from 'dayjs';
  import { GSymbol } from 'vue-material-symbols';
  import { ElMessage } from 'element-plus';
  import MarkdownIt from 'markdown-it';

  import CalendarComponent, { CalendarEvent } from '@/components/Calendar';
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

      const events = computed<CalendarEvent[]>(() => {
        const reports = reportsStoreRefs.reports.value;

        return reports.map((report) => ({
          date: report.date * 1000,
          mode: !report.body.trim().length
            ? 'warning'
            : 'success',
        }));
      });

      const currentWorkedTime = computed<number>(() => {
        const stats = statsStoreRefs.stats.value;

        return stats?.hours_worked ?? 0;
      });

      const totalQuotaTime = computed<number>(() => {
        const laborCalendar = laborCalendarStoreRefs.laborCalendar.value;

        return (laborCalendar?.workingDays ?? 0) * 8 * 60 * 60;
      });

      const currentQuotaTime = computed<number>(() => {
        const laborCalendar = currentLaborCalendarStoreRefs.laborCalendar.value;

        return ((laborCalendar?.workingDays ?? 0) * 8 * 60 * 60) || totalQuotaTime.value;
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

      async function clickCopyMonthTableHandler() {
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

      async function clickCopyMonthTextHandler() {
        let resultMarkdown = '';
        let resultHtml = '';

        const startOfMonth = selectedDate.value.startOf('month');
        const endOfMonth = selectedDate.value.endOf('month');

        const isWritingHtml = !!navigator.clipboard.write;

        for (let date = startOfMonth.date(); date <= endOfMonth.date(); date += 1) {
          const current = startOfMonth.set('date', date);
          const report = reportsStore.reports.find((item) => current.isSame(item.date * 1000, 'date'));

          if (report) {
            const trimmedBody = report.body.trim();

            if (trimmedBody.length) {
              if (isWritingHtml) {
                const htmlBody = MarkdownIt({
                  breaks: true,
                  linkify: true,
                  html: true,
                }).render(trimmedBody);

                resultHtml += htmlBody;
                resultHtml += '<br><br><br>';
              }

              resultMarkdown += trimmedBody;
              resultMarkdown += '\n\n\n\n';
            }
          }
        }

        if (navigator.clipboard.write) {
          resultHtml = `<div style="font-family: monospace; font-size: 16px">${resultHtml}</div>`;

          const markdownBlob = new Blob([resultMarkdown], {
            type: 'text/plain',
          });

          const htmlBlob = new Blob([resultHtml], {
            type: 'text/html',
          });

          await navigator.clipboard.write([
            new window.ClipboardItem({
              [markdownBlob.type]: markdownBlob,
              [htmlBlob.type]: htmlBlob,
            }),
          ]);
        } else {
          await navigator.clipboard.writeText(resultMarkdown);
        }

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

        clickCopyMonthTableHandler,
        clickCopyMonthTextHandler,
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
    @click="clickCopyMonthTableHandler">
      <template #icon>
        <el-icon size="18">
          <g-symbol
          fill
          :grade="-25"
          icon="table_view"
          type="outlined"/>
        </el-icon>
      </template>

      Скопировать в таблицу
    </el-button>

    <el-button
    @click="clickCopyMonthTextHandler">
      <template #icon>
        <el-icon size="18">
          <g-symbol
          fill
          :grade="-25"
          icon="text_fields"
          type="outlined"/>
        </el-icon>
      </template>

      Скопировать в текст
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

    min-width: 320px;
    max-width: 320px;
    padding: 16px;

    border-right: 1px solid var(--border-color-primary);
  }
</style>
