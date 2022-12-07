import { TRawStats, TStats } from '@/core/domain/stats';
import convertObject from '@/core/utils/convertObject';

export default function useStatsAdapter() {
  function convertStatsFromAPI(stats: TRawStats) {
    return convertObject<TRawStats, TStats>(stats, {
      hours: {
        nested: {
          average: {
            nested: {
              break: { callback: ({ avg_hours_break: avgHoursBreak }) => (avgHoursBreak ?? 0) * 1000 },
              work: { callback: ({ avg_hours_worked: avgHoursWorked }) => (avgHoursWorked ?? 0) * 1000 },
              start: { callback: ({ avg_start_time: avgStartTime }) => (avgStartTime ?? 0) * 1000 },
            },
          },
          total: {
            nested: {
              work: { key: 'hours_worked' },
            },
          },
        },
      },
    });
  }

  return {
    convertStatsFromAPI,
  };
}
