import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/store/auth';
import router from '@/router';

const httpClient = axios.create();

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();

  if (authStore.token && config.headers) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

httpClient.interceptors.response.use((res) => res, (error: AxiosError) => {
  const authStore = useAuthStore();

  if (error.response?.status === 401) {
    authStore.$reset();
    router.push({
      name: 'auth',
      query: {
        action: 'sign_in',
        redirect: window.location.href.replace(window.location.origin, ''),
      },
    });
  }

  throw error;
});

export default httpClient;
