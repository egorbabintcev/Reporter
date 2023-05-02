import { UniqueId, UnixTimestamp } from '@/shared-kernel';

export type TCalendarEventType = 'day_off' | 'sick_leave' | 'vacations_paid' | 'vacations_unpaid'

export type TCalendarEvent = {
  id: UniqueId
  type: TCalendarEventType

  dateFrom: UnixTimestamp
  dateTo: UnixTimestamp
}

export type TRawCalendarEventType = 'day_off' | 'sick_leave' | 'vacations_paid' | 'vacations_unpaid'

export type TRawCalendarEvent = {
  id: UniqueId
  event_type: TRawCalendarEventType

  date_from: UnixTimestamp
  date_to: UnixTimestamp
}