import axios from 'axios';
import { TRawCalendarEvent } from '@/core/domain/calendar';
import useCalendarAdapter from '@/core/adapters/calendar';

export default function useCalendarApi() {
  const calendarAdapter = useCalendarAdapter();

  async function getCalendarEventList(params: Record<string, unknown>) {
    const response = await axios.get<{events: Array<TRawCalendarEvent>}>(`/api/v1/calendar`, {
      params,
    });

    const { events } = response.data;

    return calendarAdapter.convertEventListFromApi(events);
  }

  return {
    getCalendarEventList,
  };
}
