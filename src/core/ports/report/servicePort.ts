import { Ref } from 'vue';
import { Report } from '@/core/domain/report';

export type ReportServicePort = {
  report: Ref<Report | null>
  reports: Ref<Report[]>

  readReport(id: Report['id']): Promise<void>
  readReports(): Promise<void>
  deleteReport(id: Report['id']): Promise<void>
}
