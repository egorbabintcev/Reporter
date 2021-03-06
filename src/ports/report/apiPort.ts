import { Report } from '@/domain/report';

export type OmittedReport = Omit<Report, 'id' | 'createdAt' | 'creatorId'>

export type ReportApiPort = {
  readReport(id: Report['id']): Promise<Report | null>
  readReports(): Promise<Report[]>
  createReport(report: OmittedReport): Promise<Pick<Report, 'id'>>
  updateReport(id: Report['id'], report: OmittedReport): Promise<void>
  deleteReport(id: Report['id']): Promise<void>
}
