import { defineStore } from 'pinia';
import { ref } from 'vue';
import dayjs, { Dayjs, OpUnitType } from 'dayjs';
import MarkdownIt from 'markdown-it';

import { ReportsApi } from '@/services/api.ts';
import Report = ReportsApi.Report;

export default function useReportsStore(storeId = 'reports') {
  return defineStore(storeId, () => {
    const report = ref<Report | null>(null);
    const reports = ref<Report[]>([]);

    async function getReports(...args: Parameters<typeof ReportsApi.getReports>) {
      const response = await ReportsApi.getReports(...args);

      reports.value = response.reports;
    }

    async function getReportsForTimePeriod(date: Dayjs, unit: OpUnitType) {
      await getReports({
        date_from: date.startOf(unit).unix(),
        date_to: date.endOf(unit).unix(),
      });
    }

    async function getReport(...args: Parameters<typeof ReportsApi.getReport>) {
      const response = await ReportsApi.getReport(...args);

      report.value = response.report;
    }

    async function createReport(...args: Parameters<typeof ReportsApi.createReport>) {
      await ReportsApi.createReport(...args);
    }

    type UpdateReportTimeRequest = { report_id: string } & Pick<Report, 'start_time' | 'end_time' | 'work_time' | 'break_time'>;

    async function updateReportTime(request: UpdateReportTimeRequest) {
      await ReportsApi.updateReport(request);
    }

    type UpdateReportBodyRequest = { report_id: string } & Pick<Report, 'body'>;

    async function updateReportBody(request: UpdateReportBodyRequest) {
      await ReportsApi.updateReport(request);
    };

    async function deleteReport(...args: Parameters<typeof ReportsApi.deleteReport>) {
      await ReportsApi.deleteReport(...args);
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
