import { Report, OmittedReport, PickedReport } from '@/core/domain/report';

export type ReportApiPort = {
  readReport(id: Report['id']): Promise<Report | null>
  readReports(): Promise<Report[]>
  createReport(report: OmittedReport): Promise<PickedReport>
  updateReport(id: Report['id'], report: OmittedReport): Promise<void>
  deleteReport(id: Report['id']): Promise<void>
}
