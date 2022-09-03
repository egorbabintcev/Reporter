import { RawReport, Report } from '@/core/domain/report';
import { ReportAdapterPort } from '@/core/ports/report/adapterPort';
import convertObject from '@/core/utils/convertObject';

export default function useReportAdapter(): ReportAdapterPort {
  function convertReportFromAPI(report: RawReport): Report {
    return convertObject<RawReport, Report>(report, {
      id: { key: 'id' },

      creatorId: { key: 'creator_id' },
      createdAt: { callback: ({ created_at: createdAt }) => createdAt * 1000 },

      startTime: { callback: ({ start_time: startTime }) => startTime * 1000 },
      endTime: { callback: ({ end_time: endTime }) => endTime * 1000 },
      workTime: { callback: ({ work_time: workTime }) => workTime * 1000 },
      breakTime: { callback: ({ break_time: breakTime }) => breakTime * 1000 },

      template: { key: 'template' },
    });
  }

  function convertReportListFromAPI(reportList: Array<RawReport>): Array<Report> {
    return reportList.map((report) => convertObject<RawReport, Report>(report, {
      id: { key: 'id' },

      creatorId: { key: 'creator_id' },
      createdAt: { key: 'created_at' },

      startTime: { callback: ({ start_time: startTime }) => startTime * 1000 },
      endTime: { callback: ({ end_time: endTime }) => endTime * 1000 },
      workTime: { callback: ({ work_time: workTime }) => workTime * 1000 },
      breakTime: { callback: ({ break_time: breakTime }) => breakTime * 1000 },

      template: { key: 'template' },
    }));
  }

  return {
    convertReportFromAPI,
    convertReportListFromAPI,
  };
}
