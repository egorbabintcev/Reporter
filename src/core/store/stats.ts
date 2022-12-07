import { defineStore } from 'pinia';
import { TStats } from '@/core/domain/stats';

export type TStatsState = {
  stats: TStats | null
}

const useStatsStore = (id = 'stats') => {
  return defineStore(id, {
    state: (): TStatsState => ({
      stats: null,
    }),
    actions: {
      setStats(value: TStatsState['stats']) {
        this.stats = value;
      },
    },
  })();
};

export default useStatsStore;
