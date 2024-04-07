import { defineStore } from 'pinia';
import { Dayjs, OpUnitType } from 'dayjs';

import { LaborCalendarApi } from '@/services/api.ts';

type LaborCalendar = {
  workingDays: number
  dayOffs: number
};

type State = {
  laborCalendar: LaborCalendar | null
};

export default function useLaborCalendarStore(storeId = 'labor-calendar') {
  return defineStore(storeId, {
    state: (): State => ({
      laborCalendar: null,
    }),
    actions: {
      async fetchLaborCalendar(fromDate: Dayjs, toDate: Dayjs) {
        const response = await LaborCalendarApi.getLaborCalendar({
          date_from: fromDate.unix() * 1000,
          date_to: toDate.unix() * 1000,
        });

        this.laborCalendar = {
          workingDays: response.working_days,
          dayOffs: response.day_offs,
        };
      },
      async fetchLaborCalendarForPeriod(date: Dayjs, unit: OpUnitType) {
        await this.fetchLaborCalendar(date.startOf(unit), date.endOf(unit));
      },
    },
  })();
}
