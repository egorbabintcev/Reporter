import axios from 'axios';
import useVacationAdapter from '@/core/adapters/vacation';
import {
  TVacation,
  TNewVacation,
  TRawCreatedVacation,
  TRawVacation,
} from '@/core/domain/vacation';

export default function useVacationApi() {
  const vacationAdapter = useVacationAdapter();

  async function getVacation(id: TVacation['id']) {
    const response = await axios.get<{day_off: TRawVacation}>(`/api/v3/vacations/${id}`);

    const { day_off } = response.data;

    return vacationAdapter.convertVacationFromApi(day_off);
  }

  async function createVacation(vacation: TNewVacation) {
    const response = await axios.post<TRawCreatedVacation>(`/api/v3/vacations`, vacation);

    return vacationAdapter.convertCreatedVacationFromAPI(response.data);
  }

  async function updateVacation(id: TVacation['id'], vacation: TNewVacation) {
    await axios.put<void>(`/api/v3/vacations/${id}`, vacation);
  }

  async function deleteVacation(id: TVacation['id']) {
    await axios.delete<void>(`/api/v3/vacations/${id}`);
  }

  return {
    getVacation,
    createVacation,
    updateVacation,
    deleteVacation,
  };
}
