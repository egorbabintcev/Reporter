import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

type Profile = {
  id: string
  display_name: string
  login: string
}

const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null);

  async function fetchProfile() {
    const requestUrl = `/api/v1/profile`;

    const response = await axios.get<Profile>(requestUrl);

    profile.value = response.data;
  }

  return {
    profile,

    fetchProfile,
  };
});

export default useProfileStore;
