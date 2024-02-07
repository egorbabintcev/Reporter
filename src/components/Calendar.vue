<template>
  <div class="calendar flex--dir--vertical">
    <div class="calendar-header flex--dir--horizontal flex--justify--between flex--align--center">
      <div class="flex--dir--horizontal flex--gap--8">
        <el-select
        v-model="currentYear"
        class="calendar-header__year-select">
          <el-option
          v-for="(year, index) in yearList"
          :label="year"
          :value="year"
          :key="index"/>
        </el-select>

        <el-select
        v-model="currentMonth"
        class="calendar-header__month-select">
          <el-option
          v-for="(month, index) in monthList"
          :label="month"
          :value="index"
          :key="index"/>
        </el-select>
      </div>

      <div class="flex--dir--horizontal flex--gap--6">
        <el-button
        @click="currentMonth = currentMonth - 1"
        size="small">
          <template #icon>
            <el-icon size="16">
              <GSymbol
              :grade="-25"
              icon="keyboard_arrow_left"
              :weight="200"/>
            </el-icon>
          </template>
        </el-button>

        <el-button
        @click="currentMonth = currentMonth + 1"
        size="small">
          <template #icon>
            <el-icon size="16">
              <GSymbol
              :grade="-25"
              icon="keyboard_arrow_right"
              :weight="200"/>
            </el-icon>
          </template>
        </el-button>
      </div>
    </div>

    <div class="calendar-content">
      <div class="calendar-content-legend flex--dir--horizontal">
        <div
        v-for="(day, index) in weekdayList"
        class="calendar-content-legend-day flex--dir--horizontal flex--align--center flex--justify--center flex--grow"
        :key="index">
          <p class="calendar-content-legend-day__text">
            {{ day }}
          </p>
        </div>
      </div>

      <div class="calendar-content-days">
        <div
        v-for="(day, index) in dayList"
        @click="current = day"
        class="calendar-content-day-container flex--dir--horizontal flex--align--center flex--justify--center"
        :key="index">
          <div
          class="calendar-content-day flex--dir--horizontal flex--align--center flex--justify--center"
          :class="{
            'calendar-content-day--transparent--semi': day.month() !== currentMonth,
            'calendar-content-day--active': day.isSame(current, 'day'),
            'calendar-content-day--bordered': day.isSame(today, 'day'),
          }">
            {{ day.format('DD') }}

            <div
            v-if="events.some((event) => day.isSame(event, 'day'))"
            class="calendar-content-day-event"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent, PropType, ref, watch,
  } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { UnixTimestamp } from '@/shared-kernel';
  import { GSymbol } from 'vue-material-symbols';

  export default defineComponent({
    name: 'CalendarComponent',
    props: {
      modelValue: {
        type: Dayjs,
        default: () => dayjs(),
      },
      events: {
        type: Array as PropType<UnixTimestamp[]>,
        default: () => [],
      },
    },
    emits: ['panel-change', 'update:modelValue'],
    components: {
      GSymbol,
    },
    setup(props, context) {
      const today = ref<Dayjs>(dayjs());
      const current = ref<Dayjs>(props.modelValue);
      const currentMonth = computed({
        get(): number {
          return current.value.month();
        },
        set(value: number) {
          current.value = current.value.set('month', value);
        },
      });
      const currentYear = computed({
        get(): number {
          return current.value.year();
        },
        set(value: number) {
          current.value = current.value.set('year', value);
        },
      });

      watch(current, () => {
        context.emit('update:modelValue', current.value);
      });

      watch(currentMonth, () => {
        context.emit('panel-change', current.value);
      });

      const weekdayList = dayjs.weekdaysMin(true);
      const dayList = computed<Dayjs[]>(() => {
        const res = [];

        for (let i = 0; i < 42; i += 1) {
          res.push(
            current
              .value
              .startOf('month')
              .startOf('week')
              .hour(current.value.hour())
              .minute(current.value.minute())
              .add(i, 'days'),
          );
        }

        return res;
      });

      const yearList = computed(() => {
        const year = current.value.year();
        const years = [];

        for (let i = year - 5; i < year + 5; i += 1) {
          years.push(i);
        }

        return years;
      });

      const monthList = computed(() => {
        const localeData = current.value.localeData();
        const months: string[] = [];

        for (let i = 0; i < 12; i += 1) {
          months.push(localeData.monthsShort()[i]);
        }

        return months;
      });

      return {
        weekdayList,
        dayList,
        yearList,
        monthList,

        today,
        current,
        currentMonth,
        currentYear,
      };
    },
  });
</script>

<style lang="scss">
  .calendar {
    border: 1px solid rgba(0 0 0 / 0.14);
    border-radius: 6px;
  }

  .calendar-header {
    padding: 12px 8px;

    border-bottom: 1px solid rgba(0 0 0 / 0.14);
  }

  .calendar-header__year-select {
    width: 80px;
  }

  .calendar-header__month-select {
    width: 85px;
  }

  .calendar-content {
    padding-bottom: 8px;
  }

  .calendar-content-legend {
    padding: 8px 0;

    background-color: #f5f7fa;
  }

  .calendar-content-legend-day__text {
    color: rgba(0 0 0 / 0.54);
  }

  .calendar-content-days {
    display: grid;
    grid-template-rows: repeat(6, 40px);
    grid-template-columns: repeat(7, 1fr);
  }

  .calendar-content-day-container {
    cursor: pointer;
  }

  .calendar-content-day {

    position: relative;

    width: 24px;
    height: 24px;

    border-radius: 2px;

    font-size: 14px;

    user-select: none;

    transition: 0.2s;
  }

  .calendar-content-day:not(.calendar-content-day--transparent--semi):hover,
  .calendar-content-day:not(.calendar-content-day--transparent--semi).calendar-content-day--active {
    background-color: var(--el-color-primary);

    color: var(--el-color-white);
  }

  .calendar-content-day--bordered:not(.calendar-content-day--transparent--semi) {
    border: 1px solid var(--el-color-primary);
  }

  .calendar-content-day--transparent--semi {
    opacity: 0.4;
  }

  .calendar-content-day-event {

    position: absolute;
    top: 0;
    left: 100%;

    width: 6px;
    height: 6px;

    background-color: var(--el-color-success);
    border-radius: 50%;

    transform: translate(-50%, -50%);
  }
</style>
