import axios from 'axios';
import useStatsAdapter from '@/core/adapters/stats';
import { TRawStats } from '@/core/domain/stats';

export default function useStatsApi() {
  async function readStats(params: Record<string, unknown>) {
    const statsAdapter = useStatsAdapter();

    const response = await axios.get<TRawStats>(`/api/v1/stats`, {
      params,
    });

    const stats = response.data;

    return statsAdapter.convertStatsFromAPI(stats);
  }

  return {
    readStats,
  };
}
