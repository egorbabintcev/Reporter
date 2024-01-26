import {
  AuthSignInPayload, AuthSignUpPayload,
  RawAuthSignInPayload, RawAuthSignUpPayload,
} from '@/_core/domain/auth';
import convertObject from '@/utils/convertObject';

export default function useAuthAdapter() {
  function convertAuthSignInPayloadToAPI(payload: AuthSignInPayload): RawAuthSignInPayload {
    return convertObject<AuthSignInPayload, RawAuthSignInPayload>(payload, {
      login: { key: 'username' },
      password: { key: 'password' },
    });
  }

  function convertAuthSignUpPayloadToAPI(payload: AuthSignUpPayload): RawAuthSignUpPayload {
    return convertObject<AuthSignUpPayload, RawAuthSignUpPayload>(payload, {
      display_name: { key: 'displayName' },
      login: { key: 'username' },
      password: { key: 'password' },
    });
  }

  return {
    convertAuthSignInPayloadToAPI,
    convertAuthSignUpPayloadToAPI,
  };
}
