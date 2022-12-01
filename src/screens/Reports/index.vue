<template>
  <div class="reports-screen">
    <div class="reports-screen-info">
      <p class="reports-screen-info__title">
        {{ greetingText }}
      </p>
    </div>

    <ReportsCalendar/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import useProfileStore from '@/core/store/profile';

  import ReportsCalendar from '@/screens/Reports/ReportsCalendar.vue';
  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';

  export default defineComponent({
    name: 'ReportsScreen',
    components: {
      ReportsCalendar,
    },
    setup() {
      const profileStore = useProfileStore();

      const greetingText = computed<string>(() => {
        if (profileStore.profile) {
          return `Добро пожаловать, ${profileStore.profile.displayName}!`;
        }

        return `Добро пожаловать!`;
      });

      const reportApi = useReportApi();
      const reportStore = useReportStore();

      (async () => {
        const reports = await reportApi.readReports();
        reportStore.setReports(reports);
      })();

      return {
        greetingText,
      };
    },
  });
</script>

<style lang="scss">
  .reports-screen {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    gap: 16px;

    padding: 16px;
  }

  .reports-screen-info__title {
    font-size: 24px;
    font-weight: 500;

    margin: 0;
  }

  .ant-picker-calendar-header {
    justify-content: flex-start;
  }

  .reports-date-cell-content {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
  }

  .reports-date-cell-content--disabled {
    pointer-events: none;

    opacity: 0.5;
  }

  .reports-date-cell__text {
    color: #fff;
    font-size: 14px;

    display: inline-flex;
    align-items: center;
    gap: 4px;

    margin: 0;
    padding: 2px 4px;

    user-select: none;

    background-color: #87d068;
    border-radius: 4px;
  }

  .reports-date-cell__text--neutral {
    font-size: 12px;

    background-color: #ccc;
  }
</style>
