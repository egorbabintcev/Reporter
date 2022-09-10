import {
  OmittedReport, OmittedRawReport, RawReport, Report,
} from '@/core/domain/report';

export type ReportAdapterPort = {
  convertReportFromAPI(report: RawReport): Report
  convertCreatedReportFromAPI(report: Pick<RawReport, 'id'>): Pick<Report, 'id'>
  convertReportListFromAPI(reportList: Array<RawReport>): Array<Report>
  convertReportToAPI(report: OmittedReport): OmittedRawReport
}
