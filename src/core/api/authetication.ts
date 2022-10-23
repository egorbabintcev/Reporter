import axios from 'axios';
import {
  AuthenticationPayload,
  AuthenticationToken,
} from '@/core/domain/authentication';
import useAuthenticationAdapter from '@/core/adapters/authentication';

export default function useAuthenticationApi() {
  const authenticationAdapter = useAuthenticationAdapter();

  async function signIn(payload: AuthenticationPayload): Promise<AuthenticationToken> {
    const response = await axios.post<{ token: AuthenticationToken }>(`/api/v1/sign_in`, authenticationAdapter.convertAuthenticationPayloadToAPI(payload));
    const { token } = response.data;

    return token;
  }

  return {
    signIn,
  };
}
