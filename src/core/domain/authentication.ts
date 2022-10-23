import { JWTString } from '@/shared-kernel';

export type AuthenticationPayload = {
  username: string
  password: string
}

export type RawAuthenticationPayload = {
  login: string
  password: string
}

export type AuthenticationToken = JWTString;
