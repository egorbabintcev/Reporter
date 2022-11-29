import { Profile, RawProfile } from '@/core/domain/profile';
import convertObject from '@/core/utils/convertObject';

export default function useProfileAdapter() {
  function convertProfileFromAPI(profile: RawProfile): Profile {
    return convertObject<RawProfile, Profile>(profile, {
      id: { key: 'id' },

      displayName: { key: 'display_name' },
      login: { key: 'login' },
    });
  }

  return {
    convertProfileFromAPI,
  };
}
