<template>
  <div class="reports-sidebar-stats">
    <h3 class="reports-sidebar-stats__title">
      Статистика за выбранный месяц
    </h3>

    <div class="section-12">
      <div
      class="row-8">
        <strong>
          Часов отработано:
        </strong>

        <span>
          {{ totalWorkHours }}
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

      <div class="row-8">
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

  import useStatsStore from '@/core/store/stats';
  import { getTimeStringFromDate } from '@/core/utils/time';

  export default defineComponent({
    name: 'ReportsSidebarStats',
    setup() {
      const statsStore = useStatsStore();

      const totalWorkHours = computed(() => {
        if (statsStore.stats) {
          return Math.round(((statsStore.stats.hours.total.work ?? 0) / 60 / 60) * 10) / 10;
        }

        return null;
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
        if (statsStore.stats) {
          return getTimeStringFromDate(new Date(statsStore.stats.hours.average.work));
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
        // averageStartTime,
        // averageEndTime,
        averageWorkTime,
        // averageBreakTime,
      };
    },
  });
</script>

<style lang="scss">
  .reports-sidebar-stats {
    display: flex;
    flex-flow: column nowrap;
  }
</style>
