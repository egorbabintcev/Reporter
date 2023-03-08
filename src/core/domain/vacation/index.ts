import {
  HTMLString,
  UniqueId,
  UnixTimestamp,
} from '@/shared-kernel';

export type TVacation = {
  id: UniqueId

  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
  status: string

  isPaid: boolean,
}

export type TCreatedVacation = {
  id: UniqueId
}

export type TNewVacation = {
  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString

  isPaid: boolean
}

export type TRawVacation = {
  id: UniqueId

  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
  status: string

  is_paid: boolean
}

export type TRawCreatedVacation = {
  id: UniqueId
}

export type TRawNewVacation = {
  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString

  is_paid: boolean
}
