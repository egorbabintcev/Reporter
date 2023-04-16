import axios from 'axios';
import useVacationUnpaidAdapter from '@/core/adapters/vacation-unpaid';
import {
  TVacationUnpaid,
  TNewVacationUnpaid,
  TRawCreatedVacationUnpaid,
  TRawVacationUnpaid,
} from '@/core/domain/vacation-unpaid';

export default function useVacationUnpaidApi() {
  const vacationAdapter = useVacationUnpaidAdapter();

  async function getVacationUnpaid(id: TVacationUnpaid['id']) {
    const response = await axios.get<{day_off: TRawVacationUnpaid}>(`/api/v1/vacations/${id}`);

    const { day_off } = response.data;

    return vacationAdapter.convertVacationUnpaidFromApi(day_off);
  }

  async function createVacationUnpaid(vacation: TNewVacationUnpaid) {
    const response = await axios.post<TRawCreatedVacationUnpaid>(`/api/v1/vacations`, vacationAdapter.convertVacationUnpaidToAPI(vacation));

    return vacationAdapter.convertCreatedVacationUnpaidFromAPI(response.data);
  }

  async function updateVacationUnpaid(id: TVacationUnpaid['id'], vacation: TNewVacationUnpaid) {
    await axios.put<void>(`/api/v1/vacations/${id}`, vacation);
  }

  async function deleteVacationUnpaid(id: TVacationUnpaid['id']) {
    await axios.delete<void>(`/api/v1/vacations/${id}`);
  }

  return {
    getVacationUnpaid,
    createVacationUnpaid,
    updateVacationUnpaid,
    deleteVacationUnpaid,
  };
}
