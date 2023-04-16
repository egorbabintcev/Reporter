<template>
  <div class="mentees-item row-32 row--align--center">
    <div class="mentees-item-person row-12 row--align--center">
      <div class="mentees-item-person__avatar"/>

      <div class="mentees-item-person__bio section">
        <p class="mentees-item-person__bio-name">
          Василий Пупкин
        </p>

        <p class="mentees-item-person__bio-department">
          Web-разработчик
        </p>
      </div>
    </div>

    <div class="section-12 section--grow">
      <timeline-component
      :events="events"
      :from-date="fromDate"
      :to-date="toDate"/>

      <div class="mentees-item-summary row-12">
        <p class="mentees-item-summary__text">
          Всего отработано: 165 часов
        </p>

        <p class="mentees-item-summary__text">
          Day-off: 8 часов
        </p>

        <p class="mentees-item-summary__text">
          Отпуск: 48 часов
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import { TTimelineEvent } from '@/components/Timeline/types';
  import TimelineComponent from '@/components/Timeline/index.vue';
  import dayjs from 'dayjs';

  export default defineComponent({
    name: 'MenteesItem',
    components: {
      TimelineComponent,
    },
    setup() {
      const fromDate = dayjs('2023-01-01').startOf('month');
      const toDate = dayjs('2023-01-01').endOf('month');
      const events = computed<TTimelineEvent[]>(() => [
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
          meta: {
            title: 'Отчет о работе',
            description: '10:00 - 19:00; перерыв 01:00; рабочих часов 08:00',
          },
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
      ]);

      return {
        fromDate,
        toDate,
        events,
      };
    },
  });
</script>

<style lang="scss">
  .mentees-item {
    min-height: 60px;
    padding-bottom: 16px;

    border-bottom: 1px solid rgba(0 0 0 / 8%);
  }

  .mentees-item-person__avatar {
    width: 48px;
    height: 48px;

    background-color: #40a9ff;
    border-radius: 50%;
  }

  .mentees-item-person__bio-name {
    color: rgba(0 0 0 / 87%);
    font-weight: 500;

    margin: 0;
  }

  .mentees-item-person__bio-department {
    color: rgba(0 0 0 / 54%);
    font-weight: 400;
    font-size: 12px;

    margin: 0;
  }

  .mentees-item-schedule-container {
    background-image: linear-gradient(315deg, #bababa 4.55%, #efefef 4.55%, #efefef 50%, #bababa 50%, #bababa 54.55%, #efefef 54.55%, #efefef 100%);
    background-size: 12px 12px;
    border-radius: 4px;
  }

  .mentees-item-schedule {
    flex-grow: 1;

    height: 40px;

    //background-color: #ace398;
    border-radius: 4px;

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  .mentees-item-schedule--work {
    background-color: #40a9ff;
  }

  .mentees-item-schedule--sick {
    background-color: #ffad45;
  }

  .mentees-item-schedule--vacation {
    background-color: #ace398;
  }

  .mentees-item-schedule--none {
    background-image: linear-gradient(315deg, #ff4554 4.55%, #40a9ff 4.55%, #40a9ff 50%, #ff4554 50%, #ff4554 54.55%, #40a9ff 54.55%, #40a9ff 100%);
    background-size: 12px 12px;
  }

  .mentees-item-summary__text {
    color: rgba(0 0 0 / 38%);
    font-size: 12px;

    margin: 0;
  }
</style>
