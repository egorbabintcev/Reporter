<script lang="ts">
  import { computed, defineComponent, toRefs } from 'vue';

  export default defineComponent({
    name: 'HoursStatsCard',
    props: {
      currentTime: {
        type: Number,
        default: 0,
      },
      quotaTime: {
        type: Number,
        default: 0,
      },
      totalQuotaTime: {
        type: Number,
        default: 0,
      },
    },
    setup(props) {
      const {
        currentTime,
        totalQuotaTime,
        quotaTime,
      } = toRefs(props);

      const currentHours = computed<number>(() => {
        return Math.floor(currentTime.value / 60 / 60 * 100) / 100;
      });

      const totalQuotaHours = computed<number>(() => {
        return Math.floor(totalQuotaTime.value / 60 / 60 * 100) / 100;
      });

      const timeDiff = computed<number>(() => {
        return currentTime.value - quotaTime.value;
      });

      const isNegativeHoursDiff = computed<boolean>(() => {
        return Math.sign(timeDiff.value) === -1;
      });

      const hoursDiffText = computed<string>(() => {
        const absTimeDiff = Math.abs(timeDiff.value);

        const hours = Math.floor(absTimeDiff / 60 / 60);
        const minutes = Math.floor(absTimeDiff / 60 % 60);

        const timeStringText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        return isNegativeHoursDiff.value
          ? `-${timeStringText}`
          : timeStringText;
      });

      return {
        timeDiff,
        currentHours,
        totalQuotaHours,
        isNegativeHoursDiff,
        hoursDiffText,
      };
    },
  });
</script>

<template>
  <div class="hours-stats-card">
    <p class="hours-stats-card__subtitle">
      Отработанное время (ч):
    </p>

    <p class="hours-stats-card__title">
      {{ currentHours }} / {{ totalQuotaHours }}
    </p>

    <p class="hours-stats-card__subtitle">
      Резерв часов: <span
      class="hours-stats-card__diff-text"
      :class="{
        'hours-stats-card__diff-text--danger': isNegativeHoursDiff,
      }">
        {{ hoursDiffText }}
      </span>
    </p>
  </div>
</template>

<style lang="scss">
  .hours-stats-card {
    display: flex;
    flex-flow: column nowrap;
    gap: 12px;

    padding: 8px 12px;

    border: 1px solid rgba(0 0 0 / 0.14);
  }

  .hours-stats-card__subtitle {
    font-size: 14px;
    color: rgba(0 0 0 / 0.64);
  }

  .hours-stats-card__title {
    font-size: 18px;
    font-weight: 500;
    color: rgba(0 0 0 / 0.87);
  }

  .hours-stats-card__diff-text {
    color: var(--el-color-success);
  }

  .hours-stats-card__diff-text--danger {
    color: var(--el-color-danger);
  }
</style>
