import { Ref } from 'vue';
import { Report } from '@/core/domain/report';
import { OmittedReport } from '@/core/ports/report/apiPort';

export type ReportServicePort = {
  report: Ref<Report | null>
  reports: Ref<Report[]>

  readReport(id: Report['id']): void
  readReports(): void
  createReport(report: OmittedReport): void
}
