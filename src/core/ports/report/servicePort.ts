import { Ref } from 'vue';
import { Report, OmittedReport } from '@/core/domain/report';

export type ReportServicePort = {
  report: Ref<Report | null>
  reports: Ref<Report[]>

  readReport(id: Report['id']): void
  readReports(): void
  createReport(report: OmittedReport): void
}
