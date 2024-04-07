import { defineStore } from 'pinia';
import { Dayjs, OpUnitType } from 'dayjs';

import { StatsApi } from '@/services/api.ts';
import Stats = StatsApi.Stats;

type State = {
  stats: Stats | null
};

export default function useStatsStore(storeId = 'stats') {
  return defineStore(storeId, {
    state: (): State => ({
      stats: null,
    }),
    actions: {
      async fetchStats(...args: Parameters<typeof StatsApi.getStats>) {
        this.stats = await StatsApi.getStats(...args);
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
