import axios from 'axios';
import useSickLeaveAdapter from '@/core/adapters/sick-leave';
import {
  TSickLeave,
  TNewSickLeave,
  TRawCreatedSickLeave,
  TRawSickLeave,
} from '@/core/domain/sick-leave';

export default function useSickLeaveApi() {
  const sickLeaveAdapter = useSickLeaveAdapter();

  async function getSickLeave(id: TSickLeave['id']) {
    const response = await axios.get<{sick_leave: TRawSickLeave}>(`/api/v3/sick_leaves/${id}`);

    const { sick_leave } = response.data;

    return sickLeaveAdapter.convertSickLeaveFromApi(sick_leave);
  }

  async function createSickLeave(sickLeave: TNewSickLeave) {
    const response = await axios.post<TRawCreatedSickLeave>(`/api/v3/sick_leaves`, sickLeave);

    return sickLeaveAdapter.convertCreatedSickLeaveFromAPI(response.data);
  }

  async function updateSickLeave(id: TSickLeave['id'], sickLeave: TNewSickLeave) {
    await axios.put<void>(`/api/v3/sick_leaves/${id}`, sickLeave);
  }

  async function deleteSickLeave(id: TSickLeave['id']) {
    await axios.delete<void>(`/api/v3/sick_leaves/${id}`);
  }

  return {
    getSickLeave,
    createSickLeave,
    updateSickLeave,
    deleteSickLeave,
  };
}
