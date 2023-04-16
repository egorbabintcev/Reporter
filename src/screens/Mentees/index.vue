<template>
  <div class="mentees-screen">
    <div
    class="section-16 section--grow"
    :style="{
      zIndex: 2
    }">
      <mentees-item
      v-for="index in 1"
      :show-number="true"
      :key="index"/>
    </div>

    <div
    v-if="false"
    class="grid">
      <div
      v-for="index in 31"
      class="grid-col"
      :class="{
        'grid-col--stripped': index % 2
      }"
      :key="index"/>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import TimelineComponent from '@/components/Timeline/index.vue';
  import MenteesItem from './MenteesItem.vue';
  import dayjs from 'dayjs';

  export default defineComponent({
    name: 'MenteesScreen',
    components: {
      TimelineComponent,
      MenteesItem,
    },
    setup() {
      const fromDate = dayjs('2023-01-01').startOf('month');
      const toDate = dayjs('2023-01-01').endOf('month');
      const events = [
        {
          type: 0,
          startDate: dayjs('2023-01-02'),
          endDate: dayjs('2023-01-02'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-03'),
          endDate: dayjs('2023-01-03'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-04'),
          endDate: dayjs('2023-01-04'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-05'),
          endDate: dayjs('2023-01-05'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-06'),
          endDate: dayjs('2023-01-06'),
        },

        {
          type: 0,
          startDate: dayjs('2023-01-09'),
          endDate: dayjs('2023-01-09'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-10'),
          endDate: dayjs('2023-01-10'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-11'),
          endDate: dayjs('2023-01-11'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-12'),
          endDate: dayjs('2023-01-12'),
        },
        {
          type: 2,
          startDate: dayjs('2023-01-13'),
          endDate: dayjs('2023-01-13'),
        },

        {
          type: 0,
          startDate: dayjs('2023-01-16'),
          endDate: dayjs('2023-01-16'),
        },
        {
          type: 3,
          startDate: dayjs('2023-01-17'),
          endDate: dayjs('2023-01-17'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-18'),
          endDate: dayjs('2023-01-18'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-19'),
          endDate: dayjs('2023-01-19'),
        },
        {
          type: 0,
          startDate: dayjs('2023-01-20'),
          endDate: dayjs('2023-01-20'),
        },

        {
          type: 1,
          startDate: dayjs('2023-01-23'),
          endDate: dayjs('2023-01-27'),
        },
        {
          type: 1,
          startDate: dayjs('2023-01-30'),
          endDate: dayjs('2023-01-31'),
        },
      ];

      return {
        fromDate,
        toDate,
        events,
      };
    },
  });
</script>

<style lang="scss">
  .mentees-screen {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    padding: 16px;

    position: relative;
  }

  .grid {
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;

    width: calc(100% - 234px);
    height: 100%;

    position: absolute;
    top: 0;
    left: 217px;
  }

  .grid-col {
    flex: 1 1 0;

    border-left: 1px solid rgba(0 0 0 / 6%);
  }

  .grid-col--stripped {
    background-color: rgba(0 0 0 / 2%);
  }
</style>
