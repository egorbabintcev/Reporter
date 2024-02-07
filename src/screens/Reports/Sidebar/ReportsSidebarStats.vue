<template>
  <div class="reports-sidebar-stats flex--dir--vertical flex--gap--12">
    <p class="reports-sidebar-stats__subtitle">
      Отработанное время (ч):
    </p>

    <p class="reports-sidebar-stats__title">
      {{ totalWorkHours }} / {{ totalAvailableWorkHours }}
    </p>

    <p class="reports-sidebar-stats__subtitle">
      Резерв часов: <span
      class="reports-sidebar-stats__subtitle-count"
      :class="{
        'reports-sidebar-stats__subtitle-count--success': hoursDiff > 0,
        'reports-sidebar-stats__subtitle-count--danger': hoursDiff < 0,
      }">{{ hoursDiff }}</span>
    </p>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  import dayjs from 'dayjs';

  import useStatsStore from '@/store/stats';
  import useLaborCalendarStore from '@/store/labor-calendar';

  export default defineComponent({
    name: 'ReportsSidebarStats',
    setup() {
      const statsStore = useStatsStore('month-stats');
      const statsStoreRefs = storeToRefs(statsStore);

      const laborCalendarStore = useLaborCalendarStore('month-labor-calendar');
      const laborCalendarStoreRefs = storeToRefs(laborCalendarStore);

      const currentLaborCalendarStore = useLaborCalendarStore('current-labor-calendar');
      const currentLaborCalendarStoreRefs = storeToRefs(currentLaborCalendarStore);

      const totalWorkHours = computed(() => {
        if (statsStoreRefs.stats.value) {
          return Math.round(((statsStoreRefs.stats.value.hours_worked ?? 0) / 60 / 60) * 10) / 10;
        }

        return 0;
      });

      const totalAvailableWorkHours = computed(() => {
        if (laborCalendarStoreRefs.laborCalendar.value) {
          return laborCalendarStoreRefs.laborCalendar.value.totalWorkingDays * 8;
        }

        return 0;
      });

      const currentAvailableWorkHours = computed(() => {
        if (currentLaborCalendarStoreRefs.laborCalendar.value) {
          return currentLaborCalendarStoreRefs.laborCalendar.value.totalWorkingDays * 8;
        }

        return 0;
      });

      const hoursDiff = computed(() => {
        return Math.round((totalWorkHours.value - (currentAvailableWorkHours.value || totalAvailableWorkHours.value)) * 10) / 10;
      });

      /*
      const averageStartTime = computed(() => {
        if (statsStore.stats) {
          return getTimeStringFromDate(new Date(statsStore.stats.hours.average.start ?? 0));
        }

        return null;
      });
      */

      /*
      const averageEndTime = computed(() => {
        if (statsStore.stats) {
          return getTimeStringFromDate(new Date(
            statsStore.stats.hours.average.start
              + statsStore.stats.hours.average.work
              + statsStore.stats.hours.average.break,
          ));
        }

        return null;
      });
      */

      const averageWorkTime = computed(() => {
        if (statsStoreRefs.stats.value) {
          return dayjs((statsStoreRefs.stats.value.avg_hours_worked ?? 0) * 1000)
            .utc()
            .format('HH:mm');
        }

        return null;
      });

      /*
      const averageBreakTime = computed(() => {
        if (statsStore.stats) {
          return getTimeStringFromDate(new Date(statsStore.stats.hours.average.break));
        }

        return null;
      });
      */

      return {
        totalWorkHours,
        totalAvailableWorkHours,
        currentAvailableWorkHours,
        // averageStartTime,
        // averageEndTime,
        averageWorkTime,
        hoursDiff,
        // averageBreakTime,
      };
    },
  });
</script>

<style lang="scss">
  .reports-sidebar-stats {
    padding: 8px 12px;

    border: 1px solid rgba(0 0 0 / 0.14);
  }

  .reports-sidebar-stats__subtitle {
    font-size: 14px;
    color: rgba(0 0 0 / 0.64);
  }

  .reports-sidebar-stats__subtitle-count {
    font-size: 16px;
    font-weight: 500;
  }

  .reports-sidebar-stats__subtitle-count--success {
    color: var(--el-color-success);
  }

  .reports-sidebar-stats__subtitle-count--danger {
    color: var(--el-color-danger);
  }

  .reports-sidebar-stats__title {
    font-size: 18px;
    font-weight: 500;
    color: rgba(0 0 0 / 0.87);
  }
</style>
