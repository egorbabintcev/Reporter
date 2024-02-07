import { defineStore } from 'pinia';
import dayjs from 'dayjs';

import { Report } from '@/store/reports';

type Form = {
  startTime: string
  endTime: string
  breakTime: string
  workTime: string
  body: string
};

type State = {
  form: Form
};

const useReportsEditorStore = defineStore('reports-editor', {
  state: (): State => ({
    form: {
      startTime: '',
      endTime: '',
      breakTime: '',
      workTime: '',
      body: '',
    },
  }),
  actions: {
    initFormWithReport(report: Report) {
      this.setForm({
        startTime: dayjs(report.start_time * 1000).utc().format('HH:mm'),
        endTime: dayjs(report.end_time * 1000).utc().format('HH:mm'),
        breakTime: dayjs(report.break_time * 1000).utc().format('HH:mm'),
        workTime: dayjs(report.work_time * 1000).utc().format('HH:mm'),
        body: report.body,
      });
    },
    setForm(value: Partial<Form>) {
      Object.assign(this.form, value);
    },
  },
});

export default useReportsEditorStore;
