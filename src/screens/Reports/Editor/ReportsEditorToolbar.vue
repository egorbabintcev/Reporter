<template>
  <div class="reports-editor-toolbar">
    <el-button
    @click="saveHandler({ silent: false})"
    size="large">
      <template #icon>
        <el-icon
        size="20">
          <GSymbol
          fill
          grade="-25.0"
          icon="save"
          type="outlined"/>
        </el-icon>
      </template>

      Сохранить
    </el-button>

    <el-button
    @click="showMailPopup = true"
    size="large">
      <template #icon>
        <el-icon
        size="18">
          <GSymbol
          fill
          grade="-25.0"
          icon="mail"
          type="outlined"/>
        </el-icon>
      </template>

      Отправить
    </el-button>

    <el-button
    @click="copyHandler"
    size="large">
      <template #icon>
        <el-icon
        size="18">
          <GSymbol
          fill
          grade="-25.0"
          icon="content_copy"
          type="outlined"/>
        </el-icon>
      </template>

      Копировать
    </el-button>

    <el-button
    @click="deleteHandler"
    plain
    size="large"
    type="danger">
      <template #icon>
        <el-icon
        size="18">
          <GSymbol
          fill
          grade="-25.0"
          icon="delete"
          type="outlined"/>
        </el-icon>
      </template>

      Удалить
    </el-button>

    <el-dialog
    v-model="showMailPopup"
    align-center
    cancel-text="Отмена"
    centered
    title="Отправить отчет по почте"
    width="520">
      <div class="section-16">
        <el-input
        v-model="emailForm.email"
        placeholder="Ваша почта"
        size="large"/>

        <el-input
        v-model="emailForm.password"
        placeholder="Пароль"
        show-password
        size="large"/>

        <el-input
        v-model="emailForm.recipients"
        placeholder="Получатели (через запятую)"
        size="large"/>
      </div>

      <template #footer>
        <div class="flex--dir--horizontal flex--align--center flex--justify--end flex--gap--8">
          <el-button @click="showMailPopup = false">
            Отмена
          </el-button>

          <el-button
          @click="mailReportHandler"
          type="primary">
            Сохранить и отправить
          </el-button>
        </div>
      </template>
    </el-dialog>
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
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { GSymbol } from 'vue-material-symbols';

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
      GSymbol,
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
            ElMessage.success({
              message: 'Отчет успешно сохранен',
            });
          }

          await reportStore.setReport(await reportApi.readReport(reportStore.report.id));
        }
      }

      watch(form, debounce(async () => {
        if (reportStore.report) {
          await reportApi.updateReport(reportStore.report.id, {
            ...reportStore.report,

            startTime: getDateFromTimeString(form.startTime).getTime(),
            endTime: getDateFromTimeString(form.endTime).getTime(),
            workTime: getDateFromTimeString(form.workTime).getTime(),
            breakTime: getDateFromTimeString(form.breakTime).getTime(),

            body: form.body,
          });
        }
      }, 1000));

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
      const emailForm = reactive<Record<keyof EmailPayload, string>>({
        email: localStorage.getItem('emailFormFieldEmail') ?? '',
        password: localStorage.getItem('emailFormFieldPassword') ?? '',
        recipients: JSON.parse(localStorage.getItem('emailFormFieldRecipients') ?? ''),
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
              recipients: emailForm.recipients.split(',').map((value) => value.trim()),
              subject: `ОТЧЕТ О РАБОТЕ ЗА ДЕНЬ ${getDateStringFromDate(new Date(reportStore.report.date))}`,
              body: html,
            });

            showMailPopup.value = false;

            ElMessage.success({
              message: 'Отчет успешно отправлен на почту',
            });
          }
        } catch {
          ElMessage.error({
            message: 'При отправке произошла ошибка',
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

          ElMessage.success({
            message: 'Скопировано в буфер обмена',
          });
        }
      }

      async function deleteHandler() {
        try {
          await ElMessageBox.confirm(
            'Вы точно хотите выполнить удаление? Отменить это действие будет невозможно',
            'Удалить',
            {
              confirmButtonText: 'Да',
              cancelButtonText: 'Отмена',
              type: 'warning',
            },
          );

          if (reportStore.report) {
            await reportApi.deleteReport(reportStore.report.id);

            ElMessage.info({
              message: 'Отчет успешно удален',
            });

            reportStore.setReport(null);

            await router.push({
              query: {
                ...route.query,
                id: undefined,
              },
            });
          }
        } catch {}
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
