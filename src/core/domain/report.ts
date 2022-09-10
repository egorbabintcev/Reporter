import { HTMLString, UniqueId, UnixTimestamp } from '@/shared-kernel';

export type ReportDisplayName = string;

export type Report = {
  id: UniqueId

  creatorId: UniqueId
  createdAt: UnixTimestamp

  displayName: ReportDisplayName

  startTime: UnixTimestamp
  endTime: UnixTimestamp
  workTime: UnixTimestamp
  breakTime: UnixTimestamp

  body: HTMLString
}

export type OmittedReport = Omit<Report, 'id' | 'createdAt' | 'creatorId'>

/* eslint-disable camelcase */

export type RawReportDisplayName = string;

export type RawReport = {
  id: UniqueId
  creator_id: UniqueId
  created_at: UnixTimestamp

  display_name: RawReportDisplayName

  start_time: UnixTimestamp
  end_time: UnixTimestamp
  work_time: UnixTimestamp
  break_time: UnixTimestamp

  body: HTMLString
}

/* eslint-enable camelcase */
