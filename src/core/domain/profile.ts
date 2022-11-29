import { UniqueId } from '@/shared-kernel';

type ProfileDisplayName = string

type ProfileLogin = string

export type Profile = {
  id: UniqueId

  displayName: ProfileDisplayName
  login: ProfileLogin
}

/* eslint-disable camelcase */

type RawProfileDisplayName = string

type RawProfileLogin = string

export type RawProfile = {
  id: UniqueId

  display_name: RawProfileDisplayName
  login: RawProfileLogin
}
