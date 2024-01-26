<template>
  <reports-editor-card-toolbar
  @copy="copyHandler"
  @delete="deleteHandler"
  @save="notifiedSaveHandler"/>

  <reports-editor-card-form
  v-model:body="body"
  v-model:break-time="breakTime"
  v-model:end-time="endTime"
  v-model:start-time="startTime"
  v-model:work-time="workTime"/>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent, onMounted, onUnmounted, PropType, watch,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import { debounce } from 'lodash';
  import dayjs from 'dayjs';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';

  import Logger from '@/utils/logger';
  import { getDateFromTimeString } from '@/utils/time';

  import useReportsStore, { parseReport } from '@/store/reports';
  import useReportsEditorStore from '@/screens/Reports/Editor/useReportsEditorStore';
  import useReportsScreenStore from '@/screens/Reports/useReportsScreenStore';

  import ReportsEditorCardToolbar from './ReportsEditorCardToolbar.vue';
  import ReportsEditorCardForm from './ReportsEditorCardForm.vue';
  import useStatsStore from '@/store/stats';

  export default defineComponent({
    name: 'ReportsEditorCard',
    components: {
      ReportsEditorCardToolbar,
      ReportsEditorCardForm,
    },
    props: {
      reportId: {
        type: String as PropType<string>,
        required: true,
      },
    },
    setup(props) {
      const router = useRouter();

      const dayReportsStore = useReportsStore('day-reports');

      const monthReportsStore = useReportsStore('month-reports');

      const montStatsStore = useStatsStore('month-stats');

      const reportsEditorStore = useReportsEditorStore();
      const reportsEditorStoreRefs = storeToRefs(reportsEditorStore);

      const reportsScreenStore = useReportsScreenStore();

      async function initHandler() {
        Logger.debug(`Fetching data for report ${props.reportId}`);

        await dayReportsStore.fetchReportById(props.reportId);

        const { report } = dayReportsStore;

        if (!report) return;

        reportsEditorStore.initFormWithReport(report);
      }

      onMounted(() => {
        Logger.debug(`First mount of card for report ${props.reportId}`);

        initHandler();
      });

      onUnmounted(() => {
        dayReportsStore.$reset();
        reportsEditorStore.$reset();
      });

      watch(() => props.reportId, () => {
        Logger.debug(`Rerender card for report ${props.reportId}`);

        initHandler();
      });

      async function saveHandler() {
        Logger.debug('Save handler');

        const { report } = dayReportsStore;

        if (!report) return;

        await dayReportsStore.updateReportById(report.id, {
          ...report,

          start_time: getDateFromTimeString(reportsEditorStore.form.startTime).unix(),
          end_time: getDateFromTimeString(reportsEditorStore.form.endTime).unix(),
          break_time: getDateFromTimeString(reportsEditorStore.form.breakTime).unix(),
          work_time: getDateFromTimeString(reportsEditorStore.form.workTime).unix(),
          body: reportsEditorStore.form.body,
        });

        await Promise.all([
          dayReportsStore.fetchReportById(report.id),
          monthReportsStore.fetchReportListForTimePeriod(reportsScreenStore.selectedDate, 'month'),
          montStatsStore.fetchStatsForPeriod(reportsScreenStore.selectedDate, 'month'),
        ]);
      }

      const debouncedSaveHandler = debounce(saveHandler, 500);

      async function notifiedSaveHandler() {
        await saveHandler();

        ElMessage.success('Отчет успешно сохранен');
      }

      const startTime = computed({
        get(): string {
          return reportsEditorStoreRefs.form.value.startTime;
        },
        set(value: string) {
          debouncedSaveHandler();

          reportsEditorStore.setForm({
            startTime: value,
          });
        },
      });

      const endTime = computed({
        get(): string {
          return reportsEditorStoreRefs.form.value.endTime;
        },
        set(value: string) {
          debouncedSaveHandler();

          reportsEditorStore.setForm({
            endTime: value,
          });
        },
      });

      const breakTime = computed({
        get(): string {
          return reportsEditorStoreRefs.form.value.breakTime;
        },
        set(value: string) {
          debouncedSaveHandler();

          reportsEditorStore.setForm({
            breakTime: value,
          });
        },
      });

      const workTime = computed({
        get(): string {
          return reportsEditorStoreRefs.form.value.workTime;
        },
        set(value: string) {
          debouncedSaveHandler();

          reportsEditorStore.setForm({
            workTime: value,
          });
        },
      });

      const body = computed({
        get(): string {
          return reportsEditorStoreRefs.form.value.body;
        },
        set(value: string) {
          debouncedSaveHandler();

          reportsEditorStore.setForm({
            body: value,
          });
        },
      });

      watch([startTime, endTime, breakTime], () => {
        const computedWorkTime = getDateFromTimeString(endTime.value).unix()
          - getDateFromTimeString(startTime.value).unix()
          - getDateFromTimeString(breakTime.value).unix();

        reportsEditorStore.setForm({
          workTime: computedWorkTime <= 0
            ? '00:00'
            : dayjs(computedWorkTime * 1000).utc().format('HH:mm'),
        });
      });

      async function copyHandler() {
        if (!dayReportsStore.report) return;

        await saveHandler();

        Logger.debug('Copy handler');

        const {
          markdown,
          html,
        } = parseReport(dayReportsStore.report);

        const markdownBlob = new Blob([markdown], {
          type: 'text/plain',
        });

        const htmlBlob = new Blob([html], {
          type: 'text/html',
        });

        await navigator.clipboard.write([
          new window.ClipboardItem({
            [markdownBlob.type]: markdownBlob,
            [htmlBlob.type]: htmlBlob,
          }),
        ]);

        ElMessage.success('Скопировано в буфер обмена');
      }

      async function deleteHandler() {
        const { report } = dayReportsStore;

        if (!report) return;

        await dayReportsStore.deleteReportById(report.id);

        await Promise.all([
          router.push({
            query: { report_id: undefined },
          }),
          monthReportsStore.fetchReportListForTimePeriod(reportsScreenStore.selectedDate, 'month'),
          montStatsStore.fetchStatsForPeriod(reportsScreenStore.selectedDate, 'month'),
        ]);

        ElMessage.info('Отчет удален');
      }

      return {
        notifiedSaveHandler,
        copyHandler,
        deleteHandler,

        startTime,
        endTime,
        breakTime,
        workTime,
        body,
      };
    },
  });
</script>

<style lang="scss">

</style>
