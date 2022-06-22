import { RawReport, Report } from '@/domain/report';

export type ReportAdapterPort = {
  convertReportFromAPI(report: RawReport): Report
  convertReportListFromAPI(reportList: Array<RawReport>): Array<Report>
}
