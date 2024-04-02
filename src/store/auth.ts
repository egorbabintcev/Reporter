import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import httpClient from '@/transport/http.ts';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace AuthApi {
  type SignInRequest = {
    login: string
    password: string
  };
  type SignInResponse = {
    token: string
  };

  export async function signIn(request: SignInRequest) {
    const requestUrl = `/api/v1/sign_in`;

    const response = await httpClient.post<SignInResponse>(requestUrl, request);

    return response.data;
  }

  type SignUpRequest = {
    display_name: string
    login: string
    password: string
  };
  type SignUpResponse = void;

  export async function signUp(request: SignUpRequest) {
    const requestUrl = `/api/v1/sign_up`;

    await httpClient.post<SignUpResponse>(requestUrl, request);
  }

  type GetAuthProviderUrlResponse = {
    uri: string
  };

  export async function getAuthProviderUrl() {
    const requestUrl = `/api/v1/auth/provider`;

    const response = await httpClient.post<GetAuthProviderUrlResponse>(requestUrl);

    return response.data;
  }
}

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
