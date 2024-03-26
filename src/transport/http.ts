import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/store/auth';

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
  }

  throw error;
});

export default httpClient;
