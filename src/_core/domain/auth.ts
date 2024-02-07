import { JWTString } from '@/shared-kernel';

export type AuthSignInPayload = {
  username: string
  password: string
};

export type RawAuthSignInPayload = {
  login: string
  password: string
};

export type AuthSignUpPayload = {
  displayName: string
  username: string
  password: string
};

export type RawAuthSignUpPayload = {
  display_name: string
  login: string
  password: string
};

export type AuthToken = JWTString;
