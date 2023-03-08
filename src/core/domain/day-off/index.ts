import {
  HTMLString,
  UniqueId,
  UnixTimestamp,
} from '@/shared-kernel';

export type TDayOff = {
  id: UniqueId

  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
  status: string
}

export type TCreatedDayOff = {
  id: UniqueId
}

export type TNewDayOff = {
  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp

  description: HTMLString
}

export type TRawDayOff = {
  id: UniqueId

  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
  status: string
}

export type TRawCreatedDayOff = {
  id: UniqueId
}

export type TRawNewDayOff = {
  date_from: UnixTimestamp
  date_to: UnixTimestamp

  description: HTMLString
}

export type TRawUpdatedDayOff = Partial<TRawNewDayOff>
