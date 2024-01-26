import { defineStore } from 'pinia';
import { AuthToken } from '@/_core/domain/auth';

type AuthState = {
  token: AuthToken | null
}

const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('ReporterAuthToken') ?? null,
  }),
  actions: {
    setAuthToken(token: AuthState['token']) {
      if (token === null) {
        localStorage.removeItem('ReporterAuthToken');
      } else {
        localStorage.setItem('ReporterAuthToken', token);
      }

      this.token = token;
    },
  },
});

export default useAuthStore;
