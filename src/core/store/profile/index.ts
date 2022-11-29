import { defineStore } from 'pinia';
import { Profile } from '@/core/domain/profile';

type ProfileState = {
  profile: Profile | null
}

const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
  }),
  actions: {
    setProfile(profile: ProfileState['profile']): void {
      this.profile = profile;
    },
  },
});

export default useProfileStore;
