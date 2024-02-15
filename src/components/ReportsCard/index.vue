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
        @update="updateHandler"
        :report="report"/>
      </div>
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
  import { computed, defineComponent, onBeforeMount, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import dayjs, { Dayjs } from 'dayjs';
  import { GSymbol } from 'vue-material-symbols';
  import { ElMessage, ElMessageBox } from 'element-plus';

  import ReportsCardForm from '@/components/ReportsCard/Form.vue';

  import useReportsStore, { Report, parseReport } from '@/store/reports.ts';

  import { HOUR } from '@/utils/time.ts';

  import blankImage from '@/assets/empty-folder-icon.png';

  export default defineComponent({
    name: 'ReportsCard',
    components: {
      ReportsCardForm,
      GSymbol,
    },
    setup() {
      const route = useRoute();

      const reportsStore = useReportsStore();
      const reportsStoreRefs = storeToRefs(reportsStore);

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

      async function copyClickHandler() {
        if (!reportsStore.report) return;

        const {
          markdown,
          html,
        } = parseReport(reportsStore.report);

        const markdownBlob = new Blob([markdown], {
          type: 'text/plain',
        });

        const htmlBlob = new Blob([html], {
          type: 'text/html',
        });

        if (navigator.clipboard.write) {
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
          await reportsStore.deleteReportById(reportId.value);
        }

        ElMessage.info('Отчет удален');
      }

      async function updateHandler(report: Report) {
        if (!reportId.value) return;

        await reportsStore.updateReportById(reportId.value, report);

        reportsStore.report = report;
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
          await reportsStore.fetchReportById(reportId.value);
        } else {
          reportsStore.report = null;
        }
      }

      onBeforeMount(() => {
        updateReportData();
      });

      watch(reportId, () => {
        updateReportData();
      });

      return {
        report: reportsStoreRefs.report,

        reportId,
        reportNameText,

        saveClickHandler,
        copyClickHandler,
        deleteClickHandler,
        updateHandler,
        createClickHandler,

        blankImage,
      };
    },
  });
</script>

<style lang="scss">
  @use '@/styles/variables' as *;

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

    border-bottom: 1px solid rgba(0 0 0 / 0.14);
  }

  .reports-card-header-tools {
    display: flex;
    flex-flow: row nowrap;
    gap: 12px;
  }

  .reports-card-header__title {
    font-size: 20px;
    font-weight: 600;
    color: rgba(0 0 0 / 0.68);
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
    color: $text-color-primary;
  }

  .reports-card-blank__subtitle {
    font-size: 14px;
    color: $text-color-secondary;
  }
</style>
