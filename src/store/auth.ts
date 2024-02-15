import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import httpClient from '@/transport/http.ts';

export type AuthSignInPayload = {
  login: string
  password: string
};

export type AuthSignUpPayload = {
  display_name: string
  login: string
  password: string
};

const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('ReporterAuthToken'));

  watch(token, () => {
    if (token.value) {
      localStorage.setItem('ReporterAuthToken', token.value);
    } else {
      localStorage.removeItem('ReporterAuthToken');
    }
  });

  async function signIn(payload: AuthSignInPayload) {
    const requestUrl = `/api/v1/sign_in`;

    const response = await httpClient.post<{ token: string }>(requestUrl, payload);

    token.value = response.data.token;
  }
  async function signUp(payload: AuthSignUpPayload) {
    const requestUrl = `/api/v1/sign_up`;

    await httpClient.post(requestUrl, payload);
  }

  return {
    $reset() {
      token.value = null;
    },

    token,

    signIn,
    signUp,
  };
});

export default useAuthStore;
