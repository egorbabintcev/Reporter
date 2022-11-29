import axios from 'axios';
import { RawProfile } from '@/core/domain/profile';
import useProfileAdapter from '@/core/adapters/profile';

export default function useProfileApi() {
  const profileAdapter = useProfileAdapter();

  async function readProfile() {
    const response = await axios.get<RawProfile>(`/api/v1/profile`);
    const profile = response.data;

    return profileAdapter.convertProfileFromAPI(profile);
  }

  return {
    readProfile,
  };
}
