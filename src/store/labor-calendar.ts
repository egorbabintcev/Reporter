import { defineStore } from 'pinia';
import httpClient from '@/transport/http';
import { Dayjs, OpUnitType } from 'dayjs';

type LaborCalendar = {
  totalWorkingDays: number
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
        const url = `https://isdayoff.ru/api/getdata`;

        const params = {
          date1: fromDate.format('YYYYMMDD'),
          date2: toDate.format('YYYYMMDD'),
        };

        const response = await httpClient.get<string>(url, {
          params,
          responseType: 'text',
          transitional: {
            silentJSONParsing: false,
            forcedJSONParsing: false,
          },
        });

        this.laborCalendar = {
          totalWorkingDays: response.data
            .split('')
            .map(Number)
            .filter((num) => num === 0)
            .length,
        };
      },
      async fetchLaborCalendarForPeriod(date: Dayjs, unit: OpUnitType) {
        await this.fetchLaborCalendar(date.startOf(unit), date.endOf(unit));
      },
    },
  })();
}
