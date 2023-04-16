import { defineStore } from 'pinia';
import { TCalendarEvent } from '@/core/domain/calendar';

type CalendarState = {
  eventList: TCalendarEvent[]
}

const useCalendarStore = (id = 'calendar') => {
  return defineStore(id, {
    state: (): CalendarState => ({
      eventList: [],
    }),
    actions: {
      setEventList(value: CalendarState['eventList']): void {
        this.eventList = value;
      },
    },
  })();
};

export default useCalendarStore;
