import { defineStore } from 'pinia';
import axios from 'axios';
import { UnixTimestamp } from '@/shared-kernel';
import dayjs, { Dayjs, OpUnitType } from 'dayjs';

type Stats = {
  avg_hours_break: number
  avg_hours_worked: number
  avg_start_time: number
  hours_worked: number
}

type State = {
  stats: Stats | null
}

export default function useStatsStore(storeId = 'stats') {
  return defineStore(storeId, {
    state: (): State => ({
      stats: null,
    }),
    actions: {
      async fetchStats(params?: {
        from_date: UnixTimestamp
        to_date: UnixTimestamp
      }) {
        const url = `/api/v1/stats`;

        const response = await axios.get<Stats>(url, { params });

        this.stats = response.data;
      },
      async fetchStatsForPeriod(date: Dayjs, unit: OpUnitType) {
        await this.fetchStats({
          from_date: date.startOf(unit).unix(),
          to_date: date.endOf(unit).unix(),
        });
      },
    },
  })();
}
