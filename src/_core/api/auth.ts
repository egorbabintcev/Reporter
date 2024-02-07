import httpClient from '@/transport/http';
import {
  AuthSignInPayload,
  AuthSignUpPayload,
  AuthToken,
} from '@/_core/domain/auth';
import useAuthAdapter from '@/_core/adapters/auth';

export default function useAuthApi() {
  const authAdapter = useAuthAdapter();

  async function signIn(payload: AuthSignInPayload): Promise<AuthToken> {
    const response = await httpClient.post<{ token: AuthToken }>(`/api/v1/sign_in`, authAdapter.convertAuthSignInPayloadToAPI(payload));
    const { token } = response.data;

    return token;
  }

  async function signUp(payload: AuthSignUpPayload): Promise<void> {
    await httpClient.post<null>(`/api/v1/sign_up`, authAdapter.convertAuthSignUpPayloadToAPI(payload));
  }

  return {
    signIn,
    signUp,
  };
}
