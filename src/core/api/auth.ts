import axios from 'axios';
import {
  AuthSignInPayload,
  AuthSignUpPayload,
  AuthToken,
} from '@/core/domain/auth';
import useAuthAdapter from '@/core/adapters/auth';

export default function useAuthApi() {
  const authAdapter = useAuthAdapter();

  async function signIn(payload: AuthSignInPayload): Promise<AuthToken> {
    const response = await axios.post<{ token: AuthToken }>(`/api/v1/sign_in`, authAdapter.convertAuthSignInPayloadToAPI(payload));
    const { token } = response.data;

    return token;
  }

  async function signUp(payload: AuthSignUpPayload): Promise<void> {
    await axios.post<null>(`/api/v1/sign_up`, authAdapter.convertAuthSignUpPayloadToAPI(payload));
  }

  return {
    signIn,
    signUp,
  };
}
