<script lang="ts">
  import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { GSymbol } from 'vue-material-symbols';

  type Event = {
    date: number
    mode?: 'success' | 'warning' | null
  };

  type Day = {
    text: string
    value: Dayjs
    active: boolean
    transparent: boolean
    bordered: boolean
    event: Event | null
  };

  export default defineComponent({
    name: 'CalendarComponent',
    props: {
      modelValue: {
        type: Object as PropType<Dayjs>,
        required: true,
      },
      events: {
        type: Array as PropType<Event[]>,
        default: () => [],
      },
    },
    emits: ['update:modelValue'],
    components: {
      GSymbol,
    },
    setup(props, context) {
      const {
        modelValue,
        events,
      } = toRefs(props);

      const internalValue = ref<Dayjs>(modelValue.value);

      const years = computed<number[]>(() => {
        const year = internalValue.value.year();
        const res: number[] = [];

        for (let i = year - 5; i < year + 5; i += 1) {
          res.push(i);
        }

        return res;
      });

      const year = computed({
        get(): number {
          return internalValue.value.year();
        },
        set(value: number) {
          internalValue.value = internalValue.value.year(value);
        },
      });

      const months = computed<string[]>(() => {
        const localeData = internalValue.value.localeData();
        const res: string[] = [];

        for (let i = 0; i < 12; i += 1) {
          res.push(localeData.monthsShort()[i]);
        }

        return res;
      });

      const month = computed({
        get(): number {
          return internalValue.value.month();
        },
        set(value: number) {
          internalValue.value = internalValue.value.month(value);
        },
      });

      const weekdays = computed<string[]>(() => {
        return dayjs.weekdaysMin(true);
      });

      const days = computed<Day[]>(() => {
        const res: Day[] = [];

        for (let i = 0; i < 42; i += 1) {
          const date = internalValue.value
            .startOf('month')
            .startOf('week')
            .hour(internalValue.value.hour())
            .minute(internalValue.value.minute())
            .add(i, 'days');

          const event = events.value.find((item) => {
            return date.isSame(item.date, 'date');
          });

          res.push({
            text: date.format('DD'),
            value: date,
            active: internalValue.value.isSame(date, 'date'),
            transparent: !internalValue.value.isSame(date, 'month'),
            bordered: date.isSame(Date.now(), 'date'),
            event: event ?? null,
          });
        }

        return res;
      });

      function previousMonthClickHandler() {
        month.value -= 1;
      }

      function nextMonthClickHandler() {
        month.value += 1;
      }

      function dayClickHandler(day: Day) {
        internalValue.value = day.value;
      }

      watch(modelValue, () => {
        internalValue.value = modelValue.value;
      });

      watch(internalValue, () => {
        context.emit('update:modelValue', internalValue.value);
      });

      return {
        internalValue,

        years,
        year,
        months,
        month,
        weekdays,
        days,

        previousMonthClickHandler,
        nextMonthClickHandler,
        dayClickHandler,
      };
    },
  });
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="calendar-selectors">
        <el-select
        v-model="year"
        class="calendar__year-select">
          <el-option
          v-for="(item, index) in years"
          :label="item"
          :value="item"
          :key="index"/>
        </el-select>

        <el-select
        v-model="month"
        class="calendar__month-select">
          <el-option
          v-for="(item, index) in months"
          :label="item"
          :value="index"
          :key="index"/>
        </el-select>
      </div>

      <div class="calendar-buttons">
        <el-button
        @click="previousMonthClickHandler"
        size="small">
          <template #icon>
            <el-icon size="16">
              <g-symbol
              :grade="-25"
              icon="keyboard_arrow_left"
              :weight="200"/>
            </el-icon>
          </template>
        </el-button>

        <el-button
        @click="nextMonthClickHandler"
        size="small">
          <template #icon>
            <el-icon size="16">
              <g-symbol
              :grade="-25"
              icon="keyboard_arrow_right"
              :weight="200"/>
            </el-icon>
          </template>
        </el-button>
      </div>
    </div>

    <div class="calendar-body">
      <div class="calendar-weekdays">
        <div
        v-for="(weekday, index) in weekdays"
        class="calendar-weekdays-day"
        :key="index">
          <p class="calendar-weekdays-day__text">
            {{ weekday }}
          </p>
        </div>
      </div>

      <div class="calendar-days">
        <div
        v-for="(item, index) in days"
        @click="dayClickHandler(item)"
        class="calendar-days-day"
        :class="{
          'calendar-days-day--active': item.active,
          'calendar-days-day--transparent': item.transparent,
          'calendar-days-day--bordered': item.bordered,
        }"
        :key="index">
          <p class="calendar-days-day__text">
            {{ item.text }}
          </p>

          <div
          v-if="item.event"
          class="calendar-days-day__event"
          :class="{
            'calendar-days-day__event--success': item.event.mode === 'success',
            'calendar-days-day__event--warning': item.event.mode === 'warning',
          }"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .calendar {
    display: flex;
    flex-flow: column nowrap;

    border: 1px solid rgba(0 0 0 / 0.14);
    border-radius: 6px;
  }

  .calendar-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;

    padding: 12px 8px;

    border-bottom: 1px solid rgba(0 0 0 / 0.14);
  }

  .calendar-selectors {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 8px;
  }

  .calendar__year-select {
    width: 80px;
  }

  .calendar__month-select {
    width: 85px;
  }

  .calendar-buttons {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 6px;
  }

  .calendar-body {
    padding-bottom: 8px;
  }

  .calendar-weekdays {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    padding: 8px 0;

    background-color: #f5f7fa;
  }

  .calendar-weekdays-day {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  .calendar-weekdays-day__text {
    color: var(--text-color-secondary);
  }

  .calendar-days {
    display: grid;
    grid-template-rows: repeat(6, 40px);
    grid-template-columns: repeat(7, 1fr);
    place-items: center center;
  }

  .calendar-days-day {
    position: relative;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;

    width: 26px;
    height: 26px;

    border-radius: 6px;

    cursor: pointer;
    user-select: none;

    transition: 0.2s;

    &:hover, &.calendar-days-day--active {
      background-color: var(--main-color-primary);

      color: var(--light-color-primary);
    }
  }

  .calendar-days-day:not(.calendar-days-day--transparent):hover,
  .calendar-days-day:not(.calendar-days-day--transparent).calendar-days-day--active {
    background-color: var(--main-color-primary);

    color: var(--light-color-primary);
  }

  .calendar-days-day--bordered:not(.calendar-days-day--transparent) {
    border: 1px solid var(--main-color-primary);
  }

  .calendar-days-day--transparent {
    opacity: 0.4;
  }

  .calendar-days-day__event {
    position: absolute;
    top: 0;
    left: 100%;

    width: 6px;
    height: 6px;

    border-radius: 50%;

    transform: translate(-50%, -50%);
  }

  .calendar-days-day__event--success {
    background-color: var(--main-color-success);
  }

  .calendar-days-day__event--warning {
    background-color: var(--main-color-warning);
  }
</style>
