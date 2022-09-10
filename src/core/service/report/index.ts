import { storeToRefs } from 'pinia';
import { Report, OmittedReport } from '@/core/domain/report';
import { ReportServicePort } from '@/core/ports/report/servicePort';
import useReportApi from '@/core/api/report';
import useReportStore from '@/core/store/report';

export default function useReportService(): ReportServicePort {
  const reportApi = useReportApi();
  const reportStore = useReportStore();
  const reportStoreRefs = storeToRefs(reportStore);

  async function readReport(id: Report['id']) {
    const report = await reportApi.readReport(id);

    reportStore.setReport(report);
  }

  async function readReports() {
    const reports = await reportApi.readReports();

    reportStore.setReports(reports);
  }

  async function createReport(report: OmittedReport) {
    const pickedReport: Pick<Report, 'id'> = await reportApi.createReport(report);

    await readReport(pickedReport.id);
  }

  return {
    report: reportStoreRefs.report,
    reports: reportStoreRefs.reports,
    readReport,
    readReports,
    createReport,
  };
}
