import { HTMLString, UniqueId, UnixTimestamp } from '@/shared-kernel';

export type ReportTitle = string;

export type Report = {
  id: UniqueId

  creatorId: UniqueId
  createdAt: UnixTimestamp

  title: ReportTitle

  date: UnixTimestamp
  startTime: UnixTimestamp
  endTime: UnixTimestamp
  workTime: UnixTimestamp
  breakTime: UnixTimestamp

  body: HTMLString
}

export type OmittedReport = Omit<Report, 'id' | 'createdAt' | 'creatorId'>

export type PickedReport = Pick<Report, 'id'>

export type ReportHTML<T = Report> = Record<keyof T, string>

/* eslint-disable camelcase */

export type RawReportTitle = string;

export type RawReport = {
  id: UniqueId
  creator_id: UniqueId
  created_at: UnixTimestamp

  title: RawReportTitle

  date: UnixTimestamp
  start_time: UnixTimestamp
  end_time: UnixTimestamp
  work_time: UnixTimestamp
  break_time: UnixTimestamp

  body: HTMLString
}

export type OmittedRawReport = Omit<RawReport, 'id' | 'created_at' | 'creator_id'>

export type PickedRawReport = Pick<RawReport, 'id'>

/* eslint-enable camelcase */
