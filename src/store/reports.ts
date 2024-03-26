import { defineStore } from 'pinia';
import dayjs, { Dayjs, OpUnitType } from 'dayjs';
import MarkdownIt from 'markdown-it';

import httpClient from '@/transport/http';
import { ref } from 'vue';

export type Report = {
  id: string
  creator_id: string
  created_at: number

  display_name: string

  date: number
  start_time: number
  end_time: number
  work_time: number
  break_time: number

  body: string
};

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Api {
  type GetReportRequest = {
    report_id: string
  };

  type GetReportResponse = {
    report: Report
  };

  export async function getReport(request: GetReportRequest): Promise<GetReportResponse> {
    const requestUrl = `/api/v1/reports/${encodeURIComponent(request.report_id)}`;

    const response = await httpClient.get<GetReportResponse>(requestUrl);

    return response.data;
  }

  type GetReportsRequest = {
    date_from?: number
    date_to?: number
  };

  type GetReportsResponse = {
    count: number
    reports: Report[]
  };

  export async function getReports(request: GetReportsRequest): Promise<GetReportsResponse> {
    const requestUrl = `/api/v1/reports`;

    const response = await httpClient.get<GetReportsResponse>(requestUrl, {
      params: request,
    });

    return response.data;
  }

  type CreateReportRequest = Omit<Report, 'id' | 'creator_id' | 'created_at'>;

  type CreateReportResponse = Pick<Report, 'id' | 'created_at'>;

  export async function createReport(request: CreateReportRequest): Promise<CreateReportResponse> {
    const requestUrl = `/api/v1/reports`;

    const response = await httpClient.post<CreateReportResponse>(requestUrl, request);

    return response.data;
  }

  type UpdateReportRequest = {
    report_id: string
  } & Partial<Omit<Report, 'id' | 'creator_id' | 'created_at'>>;

  type UpdateReportResponse = void;

  export async function updateReport(request: UpdateReportRequest): Promise<UpdateReportResponse> {
    const requestUrl = `/api/v1/reports/${encodeURIComponent(request.report_id)}`;

    const response = await httpClient.put<UpdateReportResponse>(requestUrl, {
      ...request,
      report_id: undefined,
    });

    return response.data;
  }

  type DeleteReportRequest = {
    report_id: string
  };

  type DeleteReportResponse = void;

  export async function deleteReport(request: DeleteReportRequest): Promise<DeleteReportResponse> {
    const requestUrl = `/api/v1/reports/${encodeURIComponent(request.report_id)}`;

    const response = await httpClient.delete<DeleteReportResponse>(requestUrl);

    return response.data;
  }
}

export default function useReportsStore(storeId = 'reports') {
  return defineStore(storeId, () => {
    const report = ref<Report | null>(null);
    const reports = ref<Report[]>([]);

    async function getReports(...args: Parameters<typeof Api.getReports>) {
      const response = await Api.getReports(...args);

      reports.value = response.reports;
    }

    async function getReportsForTimePeriod(date: Dayjs, unit: OpUnitType) {
      await getReports({
        date_from: date.startOf(unit).unix(),
        date_to: date.endOf(unit).unix(),
      });
    }

    async function getReport(...args: Parameters<typeof Api.getReport>) {
      const response = await Api.getReport(...args);

      report.value = response.report;
    }

    async function createReport(...args: Parameters<typeof Api.createReport>) {
      await Api.createReport(...args);
    }

    type UpdateReportTimeRequest = { report_id: string } & Pick<Report, 'start_time' | 'end_time' | 'work_time' | 'break_time'>;

    async function updateReportTime(request: UpdateReportTimeRequest) {
      await Api.updateReport(request);
    }

    type UpdateReportBodyRequest = { report_id: string } & Pick<Report, 'body'>;

    async function updateReportBody(request: UpdateReportBodyRequest) {
      await Api.updateReport(request);
    };

    async function deleteReport(...args: Parameters<typeof Api.deleteReport>) {
      await Api.deleteReport(...args);
    }

    return {
      $reset() {
        report.value = null;
        reports.value = [];
      },

      report,
      reports,

      getReports,
      getReportsForTimePeriod,
      getReport,
      createReport,
      updateReportTime,
      updateReportBody,
      deleteReport,
    };
  })();
}

export function parseReport(report: Report) {
  const headerDate = `Дата: ${dayjs(report.date * 1000).format('DD.MM.YYYY')}`;

  const headerTimeFields = [
    {
      name: 'Начало работы:',
      value: dayjs(report.start_time * 1000)
        .utc()
        .format('HH:mm'),
    },
    {
      name: 'Конец работы:',
      value: dayjs(report.end_time * 1000)
        .utc()
        .format('HH:mm'),
    },
    {
      name: 'Перерыв:',
      value: dayjs(report.break_time * 1000)
        .utc()
        .format('HH:mm'),
    },
    {
      name: 'Рабочих часов:',
      value: dayjs(report.work_time * 1000)
        .utc()
        .format('HH:mm'),
    },
  ];

  const markdownHeaderDate = headerDate;
  const markdownHeaderTime = headerTimeFields
    .map((field) => {
      return `${field.name.padEnd(16, ' ')}${field.value}`;
    })
    .join('\n');
  const markdownHeader = `${markdownHeaderDate}\n\n${markdownHeaderTime}`;

  const markdown = `${markdownHeader}\n\n\n${report.body}`;

  const htmlHeaderDate = headerDate;
  const htmlHeaderTime = headerTimeFields
    .map((field) => {
      return `${field.name.padEnd(16, 'x').replaceAll('x', '&nbsp;')}${field.value}`;
    })
    .join('<br/>');
  const htmlHeader = `${htmlHeaderDate}<br/><br/>${htmlHeaderTime}`;
  const htmlBody = MarkdownIt({
    breaks: true,
    linkify: true,
    html: true,
  }).render(report.body);

  const html = `<div style="font-family: monospace; font-size: 16px">${htmlHeader}<br/><br/>${htmlBody}</div>`;

  return {
    markdown,
    html,
  };
}
