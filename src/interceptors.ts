import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import useAuthStore from '@/_core/store/auth';

export default function setupAxiosInterceptors() {
  const authStore = useAuthStore();

  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    if (authStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
  });

  axios.interceptors.response.use((res) => res, (error: AxiosError) => {
    if (error.response?.status === 401) {
      authStore.setAuthToken(null);
    }

    throw error;
  });
}
