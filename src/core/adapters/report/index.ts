import {
  OmittedReport,
  OmittedRawReport,
  RawReport,
  Report,
  PickedRawReport,
  PickedReport,
} from '@/core/domain/report';
import convertObject from '@/core/utils/convertObject';

export default function useReportAdapter() {
  function convertReportFromAPI(report: RawReport): Report {
    return convertObject<RawReport, Report>(report, {
      id: { key: 'id' },

      creatorId: { key: 'creator_id' },
      createdAt: { callback: ({ created_at: createdAt }) => createdAt * 1000 },

      title: { key: 'title' },

      startTime: { callback: ({ start_time: startTime }) => startTime * 1000 },
      endTime: { callback: ({ end_time: endTime }) => endTime * 1000 },
      workTime: { callback: ({ work_time: workTime }) => workTime * 1000 },
      breakTime: { callback: ({ break_time: breakTime }) => breakTime * 1000 },

      body: { key: 'body' },
    });
  }

  function convertCreatedReportFromAPI(report: PickedRawReport): PickedReport {
    return convertObject<PickedRawReport, PickedReport>(report, {
      id: { key: 'id' },
    });
  }

  function convertReportListFromAPI(reportList: Array<RawReport>): Array<Report> {
    return reportList.map((report) => convertObject<RawReport, Report>(report, {
      id: { key: 'id' },

      creatorId: { key: 'creator_id' },
      createdAt: { key: 'created_at' },

      title: { key: 'title' },

      startTime: { callback: ({ start_time: startTime }) => startTime * 1000 },
      endTime: { callback: ({ end_time: endTime }) => endTime * 1000 },
      workTime: { callback: ({ work_time: workTime }) => workTime * 1000 },
      breakTime: { callback: ({ break_time: breakTime }) => breakTime * 1000 },

      body: { key: 'body' },
    }));
  }

  function convertReportToAPI(report: OmittedReport): OmittedRawReport {
    return convertObject<OmittedReport, OmittedRawReport>(report, {
      title: { key: 'title' },

      start_time: { callback: ({ startTime }) => startTime / 1000 },
      end_time: { callback: ({ endTime }) => endTime / 1000 },
      work_time: { callback: ({ workTime }) => workTime / 1000 },
      break_time: { callback: ({ breakTime }) => breakTime / 1000 },

      body: { key: 'body' },
    });
  }

  return {
    convertReportFromAPI,
    convertCreatedReportFromAPI,
    convertReportListFromAPI,
    convertReportToAPI,
  };
}
