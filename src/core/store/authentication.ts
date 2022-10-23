import { defineStore } from 'pinia';
import { AuthenticationToken } from '@/core/domain/authentication';

type AuthenticationState = {
  token: AuthenticationToken | null
}

const useAuthenticationStore = defineStore('authentication', {
  state: (): AuthenticationState => ({
    token: localStorage.getItem('ReporterAuthenticationToken') ?? null,
  }),
  actions: {
    setAuthenticationToken(token: AuthenticationState['token']) {
      if (token === null) {
        localStorage.removeItem('ReporterAuthenticationToken');
      } else {
        localStorage.setItem('ReporterAuthenticationToken', token);
      }

      this.token = token;
    },
  },
});

export default useAuthenticationStore;
