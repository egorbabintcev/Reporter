<template>
  <div class="reports-editor-blank">
    <div class="section-20">
      <img
      class="reports-editor-blank__image"
      :src="iconEmptyFolder">

      <div class="flex--dir--vertical flex--gap--8">
        <p class="reports-editor-blank__title">
          За этот день пока нет отчета
        </p>

        <p class="reports-editor-blank__subtitle">
          Для создания, нажмите на кнопку "Добавить"
        </p>
      </div>

      <el-button
      @click="createHandler"
      class="reports-editor-blank__button"
      size="large"
      type="primary">
        Добавить
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';

  import useReportsStore from '@/store/reports';
  import useStatsStore from '@/store/stats';
  import useReportsScreenStore from '@/screens/Reports/useReportsScreenStore';

  import iconEmptyFolder from '@/assets/empty-folder-icon.png';

  export default defineComponent({
    name: 'ReportsEditorBlank',
    setup() {
      const router = useRouter();

      const dayReportsStore = useReportsStore('day-reports');
      const monthReportsStore = useReportsStore('month-reports');
      const monthStatsStore = useStatsStore('month-stats');

      const reportsScreenStore = useReportsScreenStore();

      async function createHandler() {
        const report = await dayReportsStore.createReport({
          display_name: '',

          date: reportsScreenStore.selectedDate.unix(),

          start_time: 60 * 60 * 10,
          end_time: 60 * 60 * 19,
          break_time: 60 * 60 * 1,
          work_time: 60 * 60 * 8,

          body: '',
        });

        await Promise.all([
          router.push({
            query: { report_id: report.id },
          }),
          monthReportsStore.fetchReportListForTimePeriod(reportsScreenStore.selectedDate, 'month'),
          monthStatsStore.fetchStatsForPeriod(reportsScreenStore.selectedDate, 'month'),
        ]);
      }

      return {
        createHandler,

        iconEmptyFolder,
      };
    },
  });
</script>

<style lang="scss">
  .reports-editor-blank {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    align-items: center;
    justify-content: center;

  }

  .reports-editor-blank__image {
    width: 300px;
    height: 300px;

    object-fit: fill;
  }

  .reports-editor-blank__title,
  .reports-editor-blank__subtitle {
    text-align: center;
  }

  .reports-editor-blank__title {
    font-size: 18px;
    font-weight: 500;
  }

  .reports-editor-blank__subtitle {
    font-size: 12px;
    color: rgba(0 0 0 / 0.54);
  }

  .reports-editor-blank__button {
    align-self: center;
  }
</style>
