import { defineStore } from 'pinia';
import { Report } from '@/core/domain/report';

type ReportState = {
  report: Report | null
  reports: Report[]
}

const useReportStore = defineStore('report', {
  state: (): ReportState => ({
    report: null,
    reports: [],
  }),
  actions: {
    setReport(report: Report | null): void {
      this.report = report;
    },
    setReports(report: Report[]): void {
      this.reports = report;
    },
  },
});

export default useReportStore;
