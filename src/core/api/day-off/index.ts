import axios from 'axios';
import useDayOffAdapter from '@/core/adapters/day-off';
import {
  TDayOff,
  TNewDayOff,
  TRawCreatedDayOff,
  TRawDayOff,
} from '@/core/domain/day-off';

export default function useDayOffApi() {
  const dayOffAdapter = useDayOffAdapter();

  async function getDayOff(id: TDayOff['id']) {
    const response = await axios.get<{day_off: TRawDayOff}>(`/api/v3/day_offs/${id}`);

    const { day_off } = response.data;

    return dayOffAdapter.convertDayOffFromApi(day_off);
  }

  async function createDayOff(dayOff: TNewDayOff) {
    const response = await axios.post<TRawCreatedDayOff>(`/api/v3/day_offs`, dayOff);

    return dayOffAdapter.convertCreatedDayOffFromAPI(response.data);
  }

  async function updateDayOff(id: TDayOff['id'], dayOff: TNewDayOff) {
    await axios.put<void>(`/api/v3/day_offs/${id}`, dayOff);
  }

  async function deleteDayOff(id: TDayOff['id']) {
    await axios.delete<void>(`/api/v3/day_offs/${id}`);
  }

  return {
    getDayOff,
    createDayOff,
    updateDayOff,
    deleteDayOff,
  };
}
