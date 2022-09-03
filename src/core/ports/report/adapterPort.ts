import { RawReport, Report } from '@/core/domain/report';

export type ReportAdapterPort = {
  convertReportFromAPI(report: RawReport): Report
  convertReportListFromAPI(reportList: Array<RawReport>): Array<Report>
}
