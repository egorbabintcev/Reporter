<template>
  <div class="reports-card">
    <div
    v-if="reportId"
    class="reports-card-content">
      <div class="reports-card-header">
        <p class="reports-card-header__title">
          {{ reportNameText }}
        </p>

        <div class="reports-card-header-tools">
          <el-button
          @click="saveClickHandler"
          size="large">
            <template #icon>
              <el-icon
              size="24">
                <g-symbol
                fill
                :grade="-25"
                icon="save"
                type="outlined"/>
              </el-icon>
            </template>
          </el-button>

          <el-button
          @click="sendClickHandler"
          size="large">
            <template #icon>
              <el-icon
              size="24">
                <g-symbol
                fill
                :grade="-25"
                icon="mail"
                type="outlined"/>
              </el-icon>
            </template>
          </el-button>

          <el-button
          @click="copyClickHandler"
          size="large">
            <template #icon>
              <el-icon
              size="24">
                <g-symbol
                fill
                :grade="-25"
                icon="content_copy"
                type="outlined"/>
              </el-icon>
            </template>
          </el-button>

          <el-button
          @click="deleteClickHandler"
          plain
          size="large"
          type="danger">
            <template #icon>
              <el-icon
              size="24">
                <g-symbol
                fill
                :grade="-25"
                icon="delete"
                type="outlined"/>
              </el-icon>
            </template>
          </el-button>
        </div>
      </div>

      <div class="reports-card-editor">
        <reports-card-form
        v-model:body="body"
        v-model:break-time="breakTime"
        v-model:end-time="endTime"
        v-model:start-time="startTime"
        v-model:work-time="workTime"/>
      </div>

      <EmailPopup
      v-model:show="showEmailPopup"
      @close="showEmailPopup = false"
      @confirm="confirmEmailSendHandler"/>
    </div>

    <div
    v-else
    class="reports-card-blank">
      <img
      class="reports-card-blank__image"
      :src="blankImage">

      <div class="reports-card-blank-text">
        <p class="reports-card-blank__title">
          За этот день пока нет отчета
        </p>

        <p class="reports-card-blank__subtitle">
          Для создания, нажмите на кнопку "Добавить"
        </p>
      </div>

      <el-button
      @click="createClickHandler"
      size="large"
      type="primary">
        Добавить
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import dayjs, { Dayjs } from 'dayjs';
  import { GSymbol } from 'vue-material-symbols';
  import { ElMessage, ElMessageBox } from 'element-plus';

  import ReportsCardForm from './Form.vue';

  import useReportsStore, { parseReport } from '@/store/reports.ts';
  import useEmailStore from '@/store/email.ts';

  import { getDateFromTimeString, getTimeStringFromTimestamp, HOUR } from '@/utils/time.ts';

  import blankImage from '@/assets/empty-folder-icon.png';
  import EmailPopup from '@/components/ReportsCard/EmailPopup.vue';

  export default defineComponent({
    name: 'ReportsCard',
    components: {
      EmailPopup,
      GSymbol,
      ReportsCardForm,
    },
    setup() {
      const route = useRoute();

      const reportsStore = useReportsStore();
      const reportsStoreRefs = storeToRefs(reportsStore);
      const emailStore = useEmailStore();

      const showEmailPopup = ref<boolean>(false);

      const startTime = ref<string>('');
      const endTime = ref<string>('');
      const breakTime = ref<string>('');
      const workTime = ref<string>('');
      const body = ref<string>('');

      const reportId = computed<string | null>(() => {
        return route.query.report_id?.toString() || null;
      });

      const selectedDate = computed<Dayjs | null>(() => {
        return route.query.date
          ? dayjs(route.query.date.toString())
          : null;
      });

      const reportNameText = computed<string | null>(() => {
        const report = reportsStoreRefs.report.value;

        if (report) {
          const date = dayjs(report.date * 1000).format('DD.MM.YYYY');

          return `Отчет о работе за день ${date}`;
        }

        return null;
      });

      function saveClickHandler() {
        // Отчет сохраняется автоматически, так что эта кнопка нужна для особо волнительных
        ElMessage.success('Отчет сохранен');
      }

      function sendClickHandler() {
        showEmailPopup.value = true;
      }

      async function confirmEmailSendHandler(form: {
        email: string
        password: string
        recipients: string
      }) {
        if (!reportsStore.report) return;

        try {
          const {
            html,
          } = parseReport(reportsStore.report);

          await emailStore.sendEmail({
            email: form.email,
            password: form.password,
            recipients: form.recipients.split(',').map((value) => value.trim()).filter(Boolean),
            subject: reportNameText.value ?? '',
            body: html,
          });

          ElMessage.success('Отчет успешно отправлен на почту');
        } catch {
          ElMessage.error('Упс, при отправке что-то пошло не так');
        }
      }
      async function copyClickHandler() {
        if (!reportsStore.report) return;

        const {
          markdown,
          html,
        } = parseReport(reportsStore.report);

        if (navigator.clipboard.write) {
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
        } else {
          await navigator.clipboard.writeText(markdown);
        }

        ElMessage.success('Скопировано в буфер обмена');
      }

      async function deleteClickHandler() {
        await ElMessageBox.confirm(
          'Вы точно хотите выполнить удаление? Отменить это действие будет невозможно',
          'Удалить',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Отмена',
            type: 'warning',
          },
        );

        if (reportId.value) {
          await reportsStore.deleteReport({
            report_id: reportId.value,
          });
        }

        ElMessage.info('Отчет удален');
      }

      async function createClickHandler() {
        if (!selectedDate.value) return;

        await reportsStore.createReport({
          display_name: '',

          date: selectedDate.value.unix(),
          start_time: 10 * HOUR / 1000,
          end_time: 19 * HOUR / 1000,
          break_time: HOUR / 1000,
          work_time: 8 * HOUR / 1000,

          body: '',
        });
      }

      async function updateReportData() {
        if (reportId.value) {
          await reportsStore.getReport({
            report_id: reportId.value,
          });

          const { report } = reportsStore;

          if (report) {
            startTime.value = getTimeStringFromTimestamp(report.start_time * 1000);
            endTime.value = getTimeStringFromTimestamp(report.end_time * 1000);
            breakTime.value = getTimeStringFromTimestamp(report.break_time * 1000);
            workTime.value = getTimeStringFromTimestamp(report.work_time * 1000);
            body.value = report.body;
          }
        } else {
          reportsStore.report = null;
        }
      }

      let unwatch: () => void;

      function setupWatchers() {
        const unwatchTime = watch([startTime, endTime, breakTime, workTime], async () => {
          if (!reportId.value) return;

          await reportsStore.updateReportTime({
            report_id: reportId.value,
            start_time: getDateFromTimeString(startTime.value).unix(),
            end_time: getDateFromTimeString(endTime.value).unix(),
            break_time: getDateFromTimeString(breakTime.value).unix(),
            work_time: getDateFromTimeString(workTime.value).unix(),
          });
          reportsStore.getReport({
            report_id: reportId.value,
          });
        });

        const unwatchBody = watch(body, async () => {
          if (!reportId.value) return;

          await reportsStore.updateReportBody({
            report_id: reportId.value,
            body: body.value,
          });
          reportsStore.getReport({
            report_id: reportId.value,
          });
        });

        unwatch = () => {
          unwatchTime();
          unwatchBody();
        };
      }

      onBeforeMount(async () => {
        await updateReportData();

        setupWatchers();
      });

      watch(reportId, async () => {
        unwatch();

        await updateReportData();

        setupWatchers();
      });

      return {
        showEmailPopup,

        startTime,
        endTime,
        breakTime,
        workTime,
        body,

        reportId,
        reportNameText,

        saveClickHandler,
        sendClickHandler,
        confirmEmailSendHandler,
        copyClickHandler,
        deleteClickHandler,
        createClickHandler,

        blankImage,
      };
    },
  });
</script>

<style lang="scss">
  .reports-card {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
  }

  .reports-card-content {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
  }

  .reports-card-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 24px;

    padding: 12px 16px;

    border-bottom: 1px solid var(--border-color-primary);
  }

  .reports-card-header-tools {
    display: flex;
    flex-flow: row nowrap;
    gap: 12px;
  }

  .reports-card-header__title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-color-secondary);
  }

  .reports-card-editor {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    gap: 16px;

    padding: 16px;
  }

  .reports-card-blank {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .reports-card-blank__image {
    width: 240px;
    height: 240px;
    object-fit: contain;
  }

  .reports-card-blank-text {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .reports-card-blank__title {
    font-size: 16px;
    color: var(--text-color-primary);
  }

  .reports-card-blank__subtitle {
    font-size: 14px;
    color: var(--text-color-secondary);
  }
</style>
