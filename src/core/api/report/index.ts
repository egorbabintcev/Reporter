import axios from 'axios';
import {
  RawReport,
  Report,
  OmittedReport,
  PickedRawReport,
} from '@/core/domain/report';
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
    const response = await axios.post<PickedRawReport>('/api/v1/reports', reportAdapter.convertReportToAPI(report));

    return reportAdapter.convertCreatedReportFromAPI(response.data);
  }

  async function updateReport(id: Report['id'], report: OmittedReport) {
    await axios.put<void>(`/api/v1/reports/${id}`, reportAdapter.convertReportToAPI(report));
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
