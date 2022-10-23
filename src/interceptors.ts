import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import useAuthenticationStore from '@/core/store/authentication';

export default function setupAxiosInterceptors() {
  const authenticationStore = useAuthenticationStore();

  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    if (authenticationStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authenticationStore.token}`;
    }

    return config;
  });

  axios.interceptors.response.use((res) => res, (response: AxiosResponse) => {
    if (response.status === 401) {
      authenticationStore.setAuthenticationToken(null);
    }

    return response;
  });
}
