<template>
  <div class="reports-editor-blank">
    <div class="section-20">
      <img
      :src="iconEmptyFolder"
      class="reports-editor-blank__image">

      <div class="section-4">
        <p class="reports-editor-blank__title">
          За этот день пока нет отчетов
        </p>

        <p class="reports-editor-blank__subtitle">
          Для создания, нажмите на кнопку "Добавить"
        </p>
      </div>

      <a-button
      @click="createReportHandler"
      :loading="loading"
      type="primary"
      size="large"
      class="reports-editor-blank__button">
        Добавить
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { notification } from 'ant-design-vue';

  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';

  import iconEmptyFolder from '@/assets/empty-folder-icon.png';
  import useStatsStore from '@/core/store/stats';

  export default defineComponent({
    name: 'ReportsEditorBlank',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const reportApi = useReportApi();
      const reportStore = useReportStore();

      const loading = ref(false);

      async function createReportHandler() {
        loading.value = true;

        try {
          const date = new Date(route.query.date as string);
          date.setUTCMilliseconds(0);
          date.setUTCSeconds(0);
          date.setUTCMinutes(0);
          date.setUTCHours(0);

          const report = await reportApi.createReport({
            displayName: '',

            date: date.getTime(),

            startTime: 3600000 * 10,
            endTime: 3600000 * 19,
            workTime: 3600000 * 8,
            breakTime: 3600000 * 1,

            body: '',
          });

          notification.success({
            message: 'Отчет успешно добавлен',
            placement: 'bottomRight',
          });

          reportStore.setReport(await reportApi.readReport(report.id));

          await router.push({
            query: {
              ...route.query,
              id: report.id,
            },
          });
        } finally {
          loading.value = false;
        }
      }

      return {
        createReportHandler,
        loading,

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
    justify-content: center;
    align-items: center;

  }

  .reports-editor-blank__image {
    width: 300px;
    height: 300px;

    object-fit: fill;
  }

  .reports-editor-blank__title,
  .reports-editor-blank__subtitle {
    text-align: center;

    margin: 0;
  }

  .reports-editor-blank__title {
    font-size: 18px;
    font-weight: 500;
  }

  .reports-editor-blank__subtitle {
    color: rgba(0 0 0 / 54%);
    font-size: 12px;
  }

  .reports-editor-blank__button {
    align-self: center;
  }
</style>
