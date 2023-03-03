<template>
  <div class="timeline flex--dir--vertical flex--gap--8">
    <div class="time-line-days flex--dir--horizontal flex--grow">
      <div
      v-for="(day, index) in dayList"
      class="time-line-day"
      :key="index">
        <p class="time-line-day__text">
          {{ day.format('DD') }}
        </p>

        <p class="time-line-day__text">
          {{ day.format('dd') }}
        </p>
      </div>
    </div>

    <div class="time-line-events flex--dir--horizontal flex--grow">
      <template
      v-for="(event, index) in eventList"
      :key="index">
        <meta-popover
        :meta="event.meta">
          <div
          class="time-line-event"
          :class="{
            'time-line-event--cursor--pointer': event.meta,
            'time-line-event--background--blue': event.type === TimelineEventTypeEnum.REPORT,
            'time-line-event--background--green': event.type === TimelineEventTypeEnum.VACATION,
            'time-line-event--background--orange': event.type === TimelineEventTypeEnum.DAY_OFF,
            'time-line-event--background--gray': event.type === TimelineEventTypeEnum.NO_REPORT,
          }"
          :style="{
            width: `${event.widthPercentage}%`,
            left: `${event.leftPercentage}%`
          }">
            <icon-component
            v-if="event.type === TimelineEventTypeEnum.NO_REPORT"
            class="time-line-event__icon"
            icon="block"/>
          </div>
        </meta-popover>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    computed, defineComponent, PropType, toRefs,
  } from 'vue';
  import { Dayjs } from 'dayjs';
  import { TTimelineProps, TimelineEventTypeEnum } from './types';
  import IconComponent from '@/components/Icon/index.vue';
  import MetaPopover from '@/components/Timeline/MetaPopover.vue';

  export default defineComponent({
    name: 'TimelineComponent',
    components: {
      MetaPopover,
      IconComponent,
    },
    props: {
      fromDate: {
        type: Object as PropType<TTimelineProps['fromDate']>,
        required: true,
      },
      toDate: {
        type: Object as PropType<TTimelineProps['toDate']>,
        required: true,
      },
      events: {
        type: Array as PropType<TTimelineProps['events']>,
        default: () => [],
      },
      stackEvents: {
        type: Boolean as PropType<TTimelineProps['stackEvents']>,
        default: () => false,
      },
    },
    setup(props) {
      const {
        fromDate,
        toDate,
        events,
      } = toRefs(props);

      const eventList = computed(() => {
        const timelineLengthInDays = toDate.value.diff(fromDate.value, 'days') + 1;

        return events.value.map((event) => {
          const eventLengthInDays = event.endDate.diff(event.startDate, 'days') + 1;
          const eventStartFromTimelineStartInDays = event.startDate.diff(fromDate.value, 'days');

          return {
            widthPercentage: (Math.round(((eventLengthInDays / timelineLengthInDays) * 100) * 1000) / 1000),
            leftPercentage: (Math.round(((eventStartFromTimelineStartInDays / timelineLengthInDays) * 100) * 1000) / 1000),
            type: event.type,
            meta: event.meta,
          };
        });
      });

      const dayList = computed<Dayjs[]>(() => {
        const res = [];

        for (let start = fromDate.value; start.isBefore(toDate.value); start = start.set('date', start.date() + 1)) {
          res.push(start);
        }

        return res;
      });

      return {
        dayList,
        eventList,
        TimelineEventTypeEnum,

        logHandler: console.log,
      };
    },
  });
</script>

<style lang="scss">
  .time-line-day {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    flex: 1 1 0;
  }

  .time-line-day__text {
    color: rgba(0 0 0 / 38%);
    font-size: 12px;
    font-weight: 500;
    line-height: 1.1;

    margin: 0;
  }

  .time-line-events {
    height: 40px;
    overflow: hidden;

    position: relative;

    background-image: linear-gradient(315deg, #bababa 4.55%, #efefef 4.55%, #efefef 50%, #bababa 50%, #bababa 54.55%, #efefef 54.55%, #efefef 100%);
    background-size: 12px 12px;
    border-radius: 4px;
  }

  .time-line-event {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;

    height: 100%;

    position: absolute;

    background-color: transparent;
    border-radius: 4px;
  }

  .time-line-event--cursor--pointer {
    cursor: pointer;

    .time-line-event__icon {
      cursor: pointer;
    }
  }

  .time-line-event--background--blue {
    background: linear-gradient(315deg, #42a5f5 0%, #64b5f6 100%);
  }

  .time-line-event--background--green {
    background: linear-gradient(315deg, #66bb6a 0%, #81c784 100%);
  }

  .time-line-event--background--orange {
    background: linear-gradient(315deg, #ffa726 0%, #ffb74d 100%);
  }

  .time-line-event--background--gray {
    background-color: #efefef;
  }

  .time-line-event__icon {
    color: #ff4554;

    cursor: default;
  }
</style>
