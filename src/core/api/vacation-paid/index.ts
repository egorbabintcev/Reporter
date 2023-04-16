import axios from 'axios';
import useVacationPaidAdapter from '@/core/adapters/vacation-paid';
import {
  TVacationPaid,
  TNewVacationPaid,
  TRawCreatedVacationPaid,
  TRawVacationPaid,
} from '@/core/domain/vacation-paid';

export default function useVacationPaidApi() {
  const vacationAdapter = useVacationPaidAdapter();

  async function getVacationPaid(id: TVacationPaid['id']) {
    const response = await axios.get<{day_off: TRawVacationPaid}>(`/api/v1/vacations/${id}`);

    const { day_off } = response.data;

    return vacationAdapter.convertVacationPaidFromApi(day_off);
  }

  async function createVacationPaid(vacation: TNewVacationPaid) {
    const response = await axios.post<TRawCreatedVacationPaid>(`/api/v1/vacations`, vacationAdapter.convertVacationPaidToAPI(vacation));

    return vacationAdapter.convertCreatedVacationPaidFromAPI(response.data);
  }

  async function updateVacationPaid(id: TVacationPaid['id'], vacation: TNewVacationPaid) {
    await axios.put<void>(`/api/v1/vacations/${id}`, vacation);
  }

  async function deleteVacationPaid(id: TVacationPaid['id']) {
    await axios.delete<void>(`/api/v1/vacations/${id}`);
  }

  return {
    getVacationPaid,
    createVacationPaid,
    updateVacationPaid,
    deleteVacationPaid,
  };
}
