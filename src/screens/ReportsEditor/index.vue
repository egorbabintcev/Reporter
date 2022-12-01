<template>
  <div
  class="report-editor">
    <div class="report-editor__header">
      <a-button
      @click="goBackHandler"
      type="primary">
        <template #icon>
          <arrow-left-outlined/>
        </template>
      </a-button>

      <p class="report-editor__header-title">
        {{ headerText }}
      </p>

      <div class="report-editor__header-spacer"/>
    </div>

    <div class="report-editor__toolbar">
      <div class="report-editor__header-controls">
        <a-button
        @click="saveReportHandler"
        type="outlined"
        size="large">
          <template #icon>
            <save-filled/>
          </template>
        </a-button>

        <a-button
        @click="showMailPopup = true"
        type="outlined"
        size="large">
          <template #icon>
            <mail-filled/>
          </template>
        </a-button>

        <a-popconfirm
        @confirm="deleteReportHandler"
        title="Вы действительно хотите удалить этот отчет?"
        ok-text="Да"
        cancel-text="Отмена">
          <a-button
          type="outlined"
          size="large"
          danger>
            <template #icon>
              <delete-filled/>
            </template>
          </a-button>
        </a-popconfirm>
      </div>
    </div>

    <div class="report-editor__content">
      <ReportsEditorForm
      v-model="form"/>
    </div>
  </div>

  <a-modal
  v-model:visible="showMailPopup"
  @ok="sendReportHandler"
  title="Отправить отчет по почте"
  cancel-text="Отмена"
  ok-text="Сохранить и отправить"
  centered>
    <div class="section-16">
      <a-input
      v-model:value="emailForm.email"
      size="large"
      placeholder="Ваша почта"/>

      <a-input-password
      v-model:value="emailForm.password"
      size="large"
      type="password"
      placeholder="Пароль"/>

      <a-select
      v-model:value="emailForm.recipients"
      size="large"
      mode="tags"
      placeholder="Получатели"
      :token-separators="[',']"/>
    </div>
  </a-modal>
</template>

<script lang="ts">
  import {
    defineComponent, computed, reactive, ref, watch,
  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    ArrowLeftOutlined,
    SaveFilled,
    CopyFilled,
    DeleteFilled,
    MailFilled,
  } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';
  import { message } from 'ant-design-vue';

  import ReportsEditorForm, { TForm } from '@/screens/ReportsEditor/ReportsEditorForm.vue';

  import { getTimeStringFromDate, getDateFromTimeString } from '@/core/utils/time';
  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';
  import useEmailApi from '@/core/api/email';
  import { EmailPayload } from '@/core/domain/email';

  const emailHeader = `
    <div>
        <p>Дата %date</p>
        <p>Время: %startTime-%endTime</p>
        <p>Перерыв: %breakTime</p>
        <p>Рабочих часов: %workTime</p>
    </div>
    <br>
  `;

  export default defineComponent({
    name: 'ReportsEditor',
    components: {
      ArrowLeftOutlined,
      SaveFilled,
      CopyFilled,
      DeleteFilled,
      MailFilled,
      ReportsEditorForm,
    },
    setup() {
      const form = reactive<TForm>({
        startTime: '',
        endTime: '',
        breakTime: '',
        body: '',
      });

      const router = useRouter();
      const route = useRoute();

      const reportApi = useReportApi();
      const reportStore = useReportStore();

      (async () => {
        const report = await reportApi.readReport(route.params.id as string);

        if (report) {
          reportStore.setReport(report);

          form.startTime = getTimeStringFromDate(new Date(report.startTime));
          form.endTime = getTimeStringFromDate(new Date(report.endTime));
          form.breakTime = getTimeStringFromDate(new Date(report.breakTime));
          form.body = report.body;
        }
      })();

      async function goBackHandler() {
        await router.push({
          name: 'reports',
        });
      }

      const headerText = computed<string>(() => {
        if (reportStore.report) {
          return `Отчет за ${dayjs(reportStore.report.date).format('DD.MM.YYYY')}`;
        }

        return '';
      });

      async function saveReportHandler() {
        try {
          const { report } = reportStore;

          if (report) {
            await reportApi.updateReport(route.params.id as string, {
              ...report,

              startTime: getDateFromTimeString(form.startTime).getTime(),
              endTime: getDateFromTimeString(form.endTime).getTime(),
              breakTime: getDateFromTimeString(form.breakTime).getTime(),
              body: form.body ?? '',
            });

            message.success('Отчет успешно сохранен');
          }
        } catch {
          message.error('Произошла ошибка');
        }
      }

      const emailApi = useEmailApi();
      const showMailPopup = ref<boolean>(false);
      const emailForm = reactive<EmailPayload>({
        email: localStorage.getItem('emailFormFieldEmail') ?? '',
        password: localStorage.getItem('emailFormFieldPassword') ?? '',
        recipients: JSON.parse(localStorage.getItem('emailFormFieldRecipients') ?? '[]'),
        subject: '',
        body: '',
      });

      watch(emailForm, () => {
        localStorage.setItem('emailFormFieldEmail', emailForm.email);
        localStorage.setItem('emailFormFieldPassword', emailForm.password);
        localStorage.setItem('emailFormFieldRecipients', JSON.stringify(emailForm.recipients));
      });

      async function sendReportHandler() {
        try {
          await saveReportHandler();

          const { report } = reportStore;

          if (report) {
            const formattedEmailHeader = emailHeader
              .replace('%date', dayjs(report.date).format('DD.MM.YYYY'))
              .replace('%startTime', form.startTime)
              .replace('%endTime', form.endTime)
              .replace('%breakTime', form.breakTime)
              .replace('%workTime', getTimeStringFromDate(new Date(
                getDateFromTimeString(form.endTime).getTime()
                  - getDateFromTimeString(form.startTime).getTime()
                  - getDateFromTimeString(form.breakTime).getTime(),
              )));

            await emailApi.sendEmail({
              email: emailForm.email,
              password: emailForm.password,
              recipients: emailForm.recipients,
              subject: headerText.value,
              body: `${formattedEmailHeader}${form.body}`,
            });

            message.success('Отчет успешно отправлен');
          }
        } catch {
          message.error('Произошла ошибка');
        } finally {
          showMailPopup.value = false;
        }
      }

      async function deleteReportHandler() {
        try {
          await reportApi.deleteReport(route.params.id as string);
          await router.push({
            name: 'reports',
          });

          message.info('Отчет удален');
        } catch {
          message.error('Произошла ошибка');
        }
      }

      return {
        goBackHandler,
        saveReportHandler,
        sendReportHandler,
        deleteReportHandler,
        headerText,
        form,
        emailForm,
        showMailPopup,
      };
    },
  });
</script>

<style lang="scss">
  .report-editor {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
  }

  .report-editor__header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 16px;

    padding: 16px;

    border-bottom: 1px solid rgba(0 0 0 / 14%);
  }

  .report-editor__header-title {
    font-size: 22px;
    font-weight: 500;

    margin: 0;
  }

  .report-editor__header-spacer {
    flex-grow: 1;
  }

  .report-editor__header-controls {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 12px;
  }

  .report-editor__toolbar {
    padding: 12px 16px;

    border-bottom: 1px solid rgba(0 0 0 / 14%);
  }

  .report-editor__content {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    padding: 16px;
  }

  .report-editor__label {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    gap: 6px;
  }

  .report-editor__label-text {
    margin: 0;
  }

  .report-editor__input {
    flex-grow: 1;
  }

  .editor-wrapper {
    flex-grow: 1;

    .toastui-editor-defaultUI {
      font-family: 'Segoe UI', 'Roboto', sans-serif !important;
    }

    .toastui-editor-contents,
    .ProseMirror {
      font-size: 16px !important;
      font-family: 'Segoe UI', 'Roboto', sans-serif !important;
    }
  }
</style>
