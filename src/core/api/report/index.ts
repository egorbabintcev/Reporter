import axios from 'axios';
import { RawReport, Report, OmittedReport } from '@/core/domain/report';
import { ReportApiPort } from '@/core/ports/report/apiPort';
import useReportAdapter from '@/core/adapters/report';

export default function useReportApi(): ReportApiPort {
  const reportAdapter = useReportAdapter();

  async function readReport(id: Report['id']) {
    const response = await axios.get<{ report: RawReport }>(`/api/v1/reports/${id}`);
    const { report } = response.data;

    return reportAdapter.convertReportFromAPI(report);
  }

  async function readReports() {
    const response = await axios.get<{ reports: RawReport[] }>('/api/v1/reports');
    const { reports } = response.data;

    return reportAdapter.convertReportListFromAPI(reports);
  }

  async function createReport(report: OmittedReport) {
    const response = await axios.post<Pick<Report, 'id'>>('api/v1/reports', report);

    return response.data;
  }

  async function updateReport(id: Report['id'], report: OmittedReport) {
    await axios.patch<void>(`/api/v1/reports/${id}`, report);
  }

  async function deleteReport(id: Report['id']) {
    await axios.delete<void>(`/api/v1/reports/${id}`);
  }

  return {
    readReport,
    readReports,
    createReport,
    updateReport,
    deleteReport,
  };
}
