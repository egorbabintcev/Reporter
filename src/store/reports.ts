import { defineStore } from 'pinia';
import axios from 'axios';
import dayjs, { Dayjs, OpUnitType } from 'dayjs';

import { HTMLString, UniqueId, UnixTimestamp } from '@/shared-kernel';
import MarkdownIt from 'markdown-it';

export type Report = {
  id: UniqueId
  creator_id: UniqueId
  created_at: UnixTimestamp

  display_name: string

  date: UnixTimestamp
  start_time: UnixTimestamp
  end_time: UnixTimestamp
  work_time: UnixTimestamp
  break_time: UnixTimestamp

  body: HTMLString
}

type State = {
  report: Report | null
  reports: Report[]
}

export default function useReportsStore(storeId = 'reports') {
  return defineStore(storeId, {
    state: (): State => ({
      report: null,
      reports: [],
    }),
    actions: {
      async fetchReportsList(params?: {
        date_from: UnixTimestamp
        date_to: UnixTimestamp
      }) {
        const url = `/api/v1/reports`;
        const response = await axios.get<{ reports: Report[] }>(url, { params });

        this.reports = response.data.reports;
      },
      async fetchReportListForTimePeriod(date: Dayjs, unit: OpUnitType) {
        await this.fetchReportsList({
          date_from: date.startOf(unit).unix(),
          date_to: date.endOf(unit).unix(),
        });
      },

      async fetchReportById(id: Report['id']) {
        const url = `/api/v1/reports/${id}`;

        const response = await axios.get<{ report: Report }>(url);

        this.report = response.data.report;
      },
      async createReport(data: Omit<Report, 'id' | 'created_at' | 'creator_id'>) {
        const url = `/api/v1/reports`;

        const response = await axios.post<Pick<Report, 'id'>>(url, data);

        return response.data;
      },
      async updateReportById(id: Report['id'], data: Omit<Report, 'id' | 'created_at' | 'creator_id'>) {
        const url = `/api/v1/reports/${id}`;

        await axios.put(url, data);
      },
      async deleteReportById(id: Report['id']) {
        const url = `/api/v1/reports/${id}`;

        await axios.delete(url);
      },
    },
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
