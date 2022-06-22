import { HTMLString, UniqueId, UnixTimestamp } from '@/shared-kernel';

type ReportTemplate = {
  variables: Record<string, HTMLString>
  markup: HTMLString
}

export type Report = {
  id: UniqueId

  creatorId: UniqueId
  createdAt: UnixTimestamp

  startTime: UnixTimestamp
  endTime: UnixTimestamp
  workTime: UnixTimestamp
  breakTime: UnixTimestamp

  template: ReportTemplate
}

/* eslint-disable camelcase */

export type RawReportTemplate = {
  variables: Record<string, HTMLString>
  markup: HTMLString
}

export type RawReport = {
  id: UniqueId
  creator_id: UniqueId
  created_at: UnixTimestamp

  start_time: UnixTimestamp
  end_time: UnixTimestamp
  work_time: UnixTimestamp
  break_time: UnixTimestamp

  template: RawReportTemplate
}

/* eslint-enable camelcase */
