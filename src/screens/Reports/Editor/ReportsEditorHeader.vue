<template>
  <div class="reports-editor-header">
    <p class="reports-editor-header__title">
      Отчет о работе за {{ reportDate }}
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import useReportStore from '@/core/store/report';
  import dayjs from 'dayjs';

  export default defineComponent({
    name: 'ReportsEditorHeader',
    setup() {
      const reportStore = useReportStore();

      const reportDate = computed(() => {
        if (reportStore.report) {
          return dayjs(reportStore.report.date).format('DD.MM.YYYY');
        }

        return '';
      });

      return {
        reportDate,
      };
    },
  });
</script>

<style lang="scss">
  .reports-editor-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 16px;

    padding: 16px;

    border-bottom: 1px solid rgba(0 0 0 / 14%);
  }

  .reports-editor-header__title {
    font-size: 22px;
    font-weight: 500;
    line-height: 1;

    margin: 0;
  }
</style>
