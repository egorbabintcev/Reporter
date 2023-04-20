<template>
  <div class="flex--dir--vertical flex--gap--16">
    <h3 class="reports-sidebar-stats__title">
      Статистика за выбранный месяц
    </h3>

    <div class="flex--dir--vertical flex--gap--12">
      <div class="reports-sidebar-stats-data flex--dir--horizontal flex--gap--8 flex--align--center">
        <strong>
          Часов отработано:
        </strong>

        <span>
          {{ totalWorkHours }} / {{ totalAvailableWorkHours }}
        </span>
      </div>

      <!--
      <div class="row-8">
        <strong>
          Среднее время начала:
        </strong>

        <span>
          {{ averageStartTime }}
        </span>
      </div>
      -->

      <!--
      <div class="row-8">
        <strong>
          Среднее время окончания:
        </strong>

        <span>
          {{ averageEndTime }}
        </span>
      </div>
      -->

      <div class="reports-sidebar-stats-data flex--dir--horizontal flex--gap--8 flex--align--center">
        <strong>
          Среднее время работы:
        </strong>

        <span>
          {{ averageWorkTime }}
        </span>
      </div>

      <!--
      <div class="row-8">
        <strong>
          Среднее время перерыва:
        </strong>

        <span>
          {{ averageBreakTime }}
        </span>
      </div>
      -->
    </div>
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
        // averageStartTime,
        // averageEndTime,
        averageWorkTime,
        // averageBreakTime,
      };
    },
  });
</script>

<style lang="scss">
  .reports-sidebar-stats__title {
    color: rgba(0 0 0 / 64%);
    font-weight: 700;
  }

  .reports-sidebar-stats-data {
    strong {
      color: rgba(0 0 0 / 87%);
      font-weight: 700;
      font-size: 14px;
    }
  }
</style>
