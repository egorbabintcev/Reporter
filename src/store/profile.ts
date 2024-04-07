import { defineStore } from 'pinia';
import { ref } from 'vue';

import { ProfileApi } from '@/services/api.ts';
import Profile = ProfileApi.Profile;

const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null);

  async function fetchProfile() {
    profile.value = await ProfileApi.getProfile();
  }

  return {
    profile,

    fetchProfile,
  };
});

export default useProfileStore;
