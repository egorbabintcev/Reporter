import {
  AuthenticationPayload,
  RawAuthenticationPayload,
} from '@/core/domain/authentication';
import convertObject from '@/core/utils/convertObject';

export default function useAuthenticationAdapter() {
  function convertAuthenticationPayloadToAPI(payload: AuthenticationPayload): RawAuthenticationPayload {
    return convertObject<AuthenticationPayload, RawAuthenticationPayload>(payload, {
      login: { key: 'username' },
      password: { key: 'password' },
    });
  }

  return {
    convertAuthenticationPayloadToAPI,
  };
}
