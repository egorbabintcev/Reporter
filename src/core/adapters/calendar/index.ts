import convertObject from '@/core/utils/convertObject';
import { TCalendarEvent, TRawCalendarEvent } from '@/core/domain/calendar';

export default function useCalendarAdapter() {
  function convertEventListFromApi(eventList: Array<TRawCalendarEvent>) {
    return eventList.map((event) => convertObject<TRawCalendarEvent, TCalendarEvent>(event, {
      id: { key: 'id' },
      type: { key: 'event_type' },

      dateFrom: { callback: ({ date_from }) => date_from * 1000 },
      dateTo: { callback: ({ date_to }) => date_to * 1000 },
    }));
  }

  return {
    convertEventListFromApi,
  };
}
