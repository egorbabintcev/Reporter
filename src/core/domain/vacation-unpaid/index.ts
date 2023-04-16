import {
  HTMLString,
  UniqueId,
  UnixTimestamp,
} from '@/shared-kernel';

export type TVacationUnpaid = {
  id: UniqueId

  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
  status: string
}

export type TCreatedVacationUnpaid = {
  id: UniqueId
}

export type TNewVacationUnpaid = {
  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
}

export type TRawVacationUnpaid = {
  id: UniqueId

  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
  status: string
}

export type TRawCreatedVacationUnpaid = {
  id: UniqueId
}

export type TRawNewVacationUnpaid = {
  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
}
