import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import { AuthApi } from '@/services/api.ts';

const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('ReporterAuthToken'));

  watch(token, () => {
    if (token.value) {
      localStorage.setItem('ReporterAuthToken', token.value);
    } else {
      localStorage.removeItem('ReporterAuthToken');
    }
  });

  async function signIn(...args: Parameters<typeof AuthApi.signIn>) {
    const response = await AuthApi.signIn(...args);

    token.value = response.token;
  }

  async function signUp(...args: Parameters<typeof AuthApi.signUp>) {
    await AuthApi.signUp(...args);
  }

  async function fetchAuthProviderUrl() {
    const response = await AuthApi.getAuthProviderUrl();

    return response.uri;
  }

  return {
    $reset() {
      token.value = null;
    },

    token,

    signIn,
    signUp,
    fetchAuthProviderUrl,
  };
});

export default useAuthStore;
