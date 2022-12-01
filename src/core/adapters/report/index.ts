import {
  OmittedReport,
  OmittedRawReport,
  RawReport,
  Report,
  PickedRawReport,
  PickedReport,
  ReportHTML,
} from '@/core/domain/report';
import convertObject from '@/core/utils/convertObject';
import { getDateStringFromDate, getTimeStringFromDate } from '@/core/utils/time';

export default function useReportAdapter() {
  function convertReportFromAPI(report: RawReport): Report {
    return convertObject<RawReport, Report>(report, {
      id: { key: 'id' },

      creatorId: { key: 'creator_id' },
      createdAt: { callback: ({ created_at: createdAt }) => createdAt * 1000 },

      displayName: { key: 'display_name' },

      date: { callback: ({ date }) => date * 1000 },
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
      createdAt: { callback: ({ created_at: createdAt }) => createdAt * 1000 },

      displayName: { key: 'display_name' },

      date: { callback: ({ date }) => date * 1000 },
      startTime: { callback: ({ start_time: startTime }) => startTime * 1000 },
      endTime: { callback: ({ end_time: endTime }) => endTime * 1000 },
      workTime: { callback: ({ work_time: workTime }) => workTime * 1000 },
      breakTime: { callback: ({ break_time: breakTime }) => breakTime * 1000 },

      body: { key: 'body' },
    }));
  }

  function convertReportToAPI(report: OmittedReport): OmittedRawReport {
    return convertObject<OmittedReport, OmittedRawReport>(report, {
      display_name: { key: 'displayName' },

      date: { callback: ({ date }) => (date / 1000) },
      start_time: { callback: ({ startTime }) => startTime / 1000 },
      end_time: { callback: ({ endTime }) => endTime / 1000 },
      work_time: { callback: ({ workTime }) => workTime / 1000 },
      break_time: { callback: ({ breakTime }) => breakTime / 1000 },

      body: { key: 'body' },
    });
  }

  function convertReportToHTML(report: Report) {
    return convertObject<Report, ReportHTML>(report, {
      id: { key: 'id' },

      creatorId: { key: 'creatorId' },
      createdAt: { callback: ({ createdAt }) => getDateStringFromDate(new Date(createdAt)) },

      displayName: { key: 'displayName' },

      date: { callback: ({ date }) => getDateStringFromDate(new Date(date)) },
      startTime: { callback: ({ startTime }) => getTimeStringFromDate(new Date(startTime)) },
      endTime: { callback: ({ endTime }) => getTimeStringFromDate(new Date(endTime)) },
      breakTime: { callback: ({ breakTime }) => getTimeStringFromDate(new Date(breakTime)) },
      workTime: { callback: ({ workTime }) => getTimeStringFromDate(new Date(workTime)) },

      body: { key: 'body' },
    });
  }

  return {
    convertReportFromAPI,
    convertCreatedReportFromAPI,
    convertReportListFromAPI,
    convertReportToAPI,
    convertReportToHTML,
  };
}
