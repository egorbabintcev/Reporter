import {
  HTMLString,
  UniqueId,
  UnixTimestamp,
} from '@/shared-kernel';

export type TVacationPaid = {
  id: UniqueId

  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
  status: string
}

export type TCreatedVacationPaid = {
  id: UniqueId
}

export type TNewVacationPaid = {
  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
}

export type TRawVacationPaid = {
  id: UniqueId

  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
  status: string
}

export type TRawCreatedVacationPaid = {
  id: UniqueId
}

export type TRawNewVacationPaid = {
  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
}
