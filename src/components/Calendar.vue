<template>
  <a-calendar
  @change="$emit('update:modelValue', $event)"
  @panel-change="$emit('panel-change', $event)"
  class="calendar"
  :fullscreen="false"
  :value="modelValue">
    <template #dateCellRender="{ current }">
      <a-badge
      class="calendar__badge"
      :status="
        events.some(event => current.isSame(event, 'day'))
          ? 'success'
          : null
      "/>
    </template>

    <template #headerRender="{ value: current, onChange }">
      <div class="calendar-header">
        <div class="row-8">
          <a-select
          @change="
            selectedYear => {
              logHandler(selectedYear);
              onChange(current.year(selectedYear));
            }
          "
          :dropdown-match-select-width="false"
          size="small"
          :value="String(current.year())">
            <a-select-option
            v-for="val in getYearList(current)"
            :key="String(val)">
              {{ val }}
            </a-select-option>
          </a-select>

          <a-select
          @change="
            selectedMonth => {
              onChange(current.month(parseInt(String(selectedMonth), 10)));
            }
          "
          :dropdown-match-select-width="false"
          size="small"
          :value="String(current.month())">
            <a-select-option
            v-for="(val, index) in getMonthList(current)"
            :key="String(index)">
              {{ val }}
            </a-select-option>
          </a-select>
        </div>

        <div class="row-4">
          <a-button
          @click="onChange(current.month(current.month() - 1))"
          size="small">
            <template #icon>
              <LeftOutlined
              :style="{
                fontSize: '10px'
              }"/>
            </template>
          </a-button>

          <a-button
          @click="onChange(current.month(current.month() + 1))"
          size="small">
            <template #icon>
              <RightOutlined
              :style="{
                fontSize: '10px'
              }"/>
            </template>
          </a-button>
        </div>
      </div>
    </template>
  </a-calendar>
</template>

<script lang="ts">
  import {
    defineComponent, PropType,
  } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { UnixTimestamp } from '@/shared-kernel';

  import {
    LeftOutlined,
    RightOutlined,
  } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'CalendarComponent',
    components: {
      LeftOutlined,
      RightOutlined,
    },
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
    setup() {
      function getYearList(date: Dayjs) {
        const year = date.year();
        const years = [];

        for (let i = year - 5; i < year + 5; i += 1) {
          years.push(i);
        }

        return years;
      }

      function getMonthList(date: Dayjs) {
        const localeData = date.localeData();
        const months = [];

        for (let i = 0; i < 12; i++) {
          months.push(localeData.monthsShort(date.month(i)));
        }
        return months;
      }

      return {
        getYearList,
        getMonthList,
        logHandler(message: unknown) {
          console.log(message);
        },
      };
    },
  });
</script>

<style lang="scss">
  .calendar {
    border: 1px solid rgba(0 0 0 / 14%);
    border-radius: 2px;

    .ant-picker-calendar-header {
      justify-content: flex-start;
    }

    .ant-picker-calendar-date-content {
      line-height: 0 !important;

      height: 0 !important;
    }
  }

  .calendar-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;

    padding: 12px 8px;
  }

  .calendar__badge {
    position: absolute;
    top: -2px;
    right: -12px;
  }
</style>
