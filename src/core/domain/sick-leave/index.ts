import {
  HTMLString,
  UniqueId,
  UnixTimestamp,
} from '@/shared-kernel';

export type TSickLeave = {
  id: UniqueId

  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
  status: string
}

export type TCreatedSickLeave = {
  id: UniqueId
}

export type TNewSickLeave = {
  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
}

export type TRawSickLeave = {
  id: UniqueId

  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
  status: string
}

export type TRawCreatedSickLeave = {
  id: UniqueId
}

export type TRawNewSickLeave = {
  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
}

export type TRawUpdatedSickLeave = Partial<TRawNewSickLeave>
