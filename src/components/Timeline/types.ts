import { Dayjs } from 'dayjs';
import { HTMLString } from '@/shared-kernel';

export enum TimelineEventTypeEnum {
  REPORT,
  VACATION,
  DAY_OFF,
  NO_REPORT,
}

export type TTimelineEvent = {
  type: TimelineEventTypeEnum
  startDate: Dayjs
  endDate: Dayjs

  meta?: {
    title: HTMLString,
    description: HTMLString
  }
}

export type TTimelineProps = {
  fromDate: Dayjs
  toDate: Dayjs

  events: TTimelineEvent[]

  stackEvents: boolean
}
