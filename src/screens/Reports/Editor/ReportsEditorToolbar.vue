<template>
  <div class="reports-editor-toolbar">
    <a-button
    @click="saveHandler({ silent: false })"
    size="large"
    type="outlined">
      <template #icon>
        <icon-component
        class="reports-editor-toolbar-button__icon"
        icon="save"/>
      </template>
    </a-button>

    <a-button
    @click="showMailPopup = true"
    size="large"
    type="outlined">
      <template #icon>
        <icon-component
        class="reports-editor-toolbar-button__icon"
        icon="email"/>
      </template>
    </a-button>

    <a-button
    @click="copyHandler"
    size="large"
    type="outlined">
      <template #icon>
        <icon-component
        class="reports-editor-toolbar-button__icon"
        icon="file_copy"/>
      </template>
    </a-button>

    <a-popconfirm
    @confirm="deleteHandler"
    placement="rightTop"
    title="Вы уверены, что хотите удалить отчет?">
      <a-button
      danger
      size="large"
      type="outlined">
        <template #icon>
          <icon-component
          class="reports-editor-toolbar-button__icon"
          icon="delete"/>
        </template>
      </a-button>
    </a-popconfirm>

    <a-modal
    v-model:visible="showMailPopup"
    @ok="mailReportHandler"
    cancel-text="Отмена"
    centered
    ok-text="Сохранить и отправить"
    title="Отправить отчет по почте">
      <div class="section-16">
        <a-input
        v-model:value="emailForm.email"
        placeholder="Ваша почта"
        size="large"/>

        <a-input-password
        v-model:value="emailForm.password"
        placeholder="Пароль"
        size="large"
        type="password"/>

        <a-select
        v-model:value="emailForm.recipients"
        mode="tags"
        placeholder="Получатели"
        size="large"
        :token-separators="[',']"/>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    reactive,
    watch,
  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from 'lodash';
  import MarkdownIt from 'markdown-it';
  import { notification } from 'ant-design-vue';

  import IconComponent from '@/components/Icon.vue';

  import { Report } from '@/core/domain/report';
  import { EmailPayload } from '@/core/domain/email';
  import useEmailApi from '@/core/api/email';
  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';
  import { getDateFromTimeString, getDateStringFromDate, getTimeStringFromDate } from '@/core/utils/time';
  import useForm from './useForm';

  export default defineComponent({
    name: 'ReportsEditorToolbar',
    components: {
      IconComponent,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();

      const reportApi = useReportApi();
      const reportStore = useReportStore();

      const { form } = useForm();
      async function saveHandler(options = { silent: true }) {
        if (reportStore.report) {
          await reportApi.updateReport(reportStore.report.id, {
            ...reportStore.report,

            startTime: getDateFromTimeString(form.startTime).getTime(),
            endTime: getDateFromTimeString(form.endTime).getTime(),
            workTime: getDateFromTimeString(form.workTime).getTime(),
            breakTime: getDateFromTimeString(form.breakTime).getTime(),

            body: form.body,
          });

          if (!options.silent) {
            notification.success({
              message: 'Отчет успешно сохранен',
              placement: 'bottomRight',
            });
          }

          await reportStore.setReport(await reportApi.readReport(reportStore.report.id));
        }
      }

      watch(form, debounce(() => { saveHandler(); }, 1000));

      function parseReport(report: Report) {
        const headerDate = `Дата: ${getDateStringFromDate(new Date(report.date))}`;

        const headerTimeFields = [
          {
            name: 'Начало работы:',
            value: getTimeStringFromDate(new Date(report.startTime)),
          },
          {
            name: 'Конец работы:',
            value: getTimeStringFromDate(new Date(report.endTime)),
          },
          {
            name: 'Перерыв:',
            value: getTimeStringFromDate(new Date(report.breakTime)),
          },
          {
            name: 'Рабочих часов:',
            value: getTimeStringFromDate(new Date(report.workTime)),
          },
        ];

        const markdownHeaderDate = headerDate;
        const markdownHeaderTime = headerTimeFields
          .map((field) => {
            return `${field.name.padEnd(16, ' ')}${field.value}`;
          })
          .join('\n');
        const markdownHeader = `${markdownHeaderDate}\n\n${markdownHeaderTime}`;

        const markdown = `${markdownHeader}\n\n\n${report.body}`;

        const htmlHeaderDate = headerDate;
        const htmlHeaderTime = headerTimeFields
          .map((field) => {
            return `${field.name.padEnd(16, 'x').replaceAll('x', '&nbsp;')}${field.value}`;
          })
          .join('<br/>');
        const htmlHeader = `${htmlHeaderDate}<br/><br/>${htmlHeaderTime}`;
        const htmlBody = MarkdownIt({
          breaks: true,
          linkify: true,
          html: true,
        }).render(report.body);

        const html = `<div style="font-family: monospace; font-size: 16px">${htmlHeader}<br/><br/>${htmlBody}</div>`;

        return {
          markdown,
          html,
        };
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

      async function mailReportHandler() {
        await saveHandler();

        try {
          if (reportStore.report) {
            const {
              html,
            } = parseReport(reportStore.report);

            await emailApi.sendEmail({
              email: emailForm.email,
              password: emailForm.password,
              recipients: emailForm.recipients,
              subject: `ОТЧЕТ О РАБОТЕ ЗА ДЕНЬ ${getDateStringFromDate(new Date(reportStore.report.date))}`,
              body: html,
            });

            showMailPopup.value = false;

            notification.success({
              message: 'Отчет успешно отправлен на почту',
              placement: 'bottomRight',
            });
          }
        } catch {
          notification.error({
            message: 'При отправке произошла ошибка',
            placement: 'bottomRight',
          });
        }
      }

      async function copyHandler() {
        await saveHandler();

        if (reportStore.report) {
          const {
            markdown,
            html,
          } = parseReport(reportStore.report);

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

          notification.success({
            message: 'Скопировано в буфер обмена',
            placement: 'bottomRight',
          });
        }
      }

      async function deleteHandler() {
        if (reportStore.report) {
          await reportApi.deleteReport(reportStore.report.id);

          notification.info({
            message: 'Отчет успешно удален',
            placement: 'bottomRight',
          });

          reportStore.setReport(null);

          await router.push({
            query: {
              ...route.query,
              id: undefined,
            },
          });
        }
      }

      return {
        saveHandler,
        mailReportHandler,
        copyHandler,
        deleteHandler,

        showMailPopup,
        emailForm,
      };
    },
  });
</script>

<style lang="scss">
  .reports-editor-toolbar {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 12px;

    padding: 12px 16px;

    border-bottom: 1px solid rgba(0 0 0 / 14%);
  }

  .reports-editor-toolbar-button__icon {
    font-size: 24px !important;

    display: inline-flex !important;
    align-items: center;
    justify-content: center;

    width: 28px;
    height: 28px;
  }
</style>
