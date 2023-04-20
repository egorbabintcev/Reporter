import { defineStore } from 'pinia';
import axios from 'axios';
import { Dayjs, OpUnitType } from 'dayjs';

type LaborCalendar = {
  totalWorkingDays: number
}

type State = {
  laborCalendar: LaborCalendar | null
}

export default function useLaborCalendarStore(storeId = 'labor-calendar') {
  return defineStore(storeId, {
    state: (): State => ({
      laborCalendar: null,
    }),
    actions: {
      // TODO: refactor this, pls)
      async fetchLaborCalendarForPeriod(date: Dayjs, unit: OpUnitType) {
        const url = `https://isdayoff.ru/api/getdata`;

        const params = {
          date1: date.startOf(unit).format('YYYYMMDD'),
          date2: date.endOf(unit).format('YYYYMMDD'),
        };

        const response = await axios.get<string>(url, {
          params,
          responseType: 'text',
          transitional: {
            silentJSONParsing: false,
            forcedJSONParsing: false,
          },
        });

        console.log(response);

        this.laborCalendar = {
          totalWorkingDays: response.data
          .split('')
          .map(Number)
          .filter((num) => num === 0)
          .length,
        };
      },
    },
  })();
}
