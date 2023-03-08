import convertObject from '@/core/utils/convertObject';
import {
  TCreatedDayOff,
  TDayOff,
  TNewDayOff,
  TRawCreatedDayOff,
  TRawDayOff,
  TRawNewDayOff,
} from '@/core/domain/day-off';

export default function useDayOffAdapter() {
  function convertDayOffFromApi(dayOff: TRawDayOff) {
    return convertObject<TRawDayOff, TDayOff>(dayOff, {
      id: { key: 'id' },

      dateFrom: { callback: ({ date_from }) => date_from * 1000 },
      dateTo: { callback: ({ date_to }) => date_to * 1000 },

      description: { key: 'description' },
      status: { key: 'status' },
    });
  }

  function convertCreatedDayOffFromAPI(dayOff: TRawCreatedDayOff) {
    return convertObject<TRawCreatedDayOff, TCreatedDayOff>(dayOff, {
      id: { key: 'id' },
    });
  }

  function convertDayOffToAPI(dayOff: TNewDayOff) {
    return convertObject<TNewDayOff, TRawNewDayOff>(dayOff, {
      date_from: { callback: ({ dateFrom }) => dateFrom / 1000 },
      date_to: { callback: ({ dateTo }) => dateTo / 1000 },

      description: { key: 'description' },
    });
  }

  return {
    convertDayOffFromApi,
    convertCreatedDayOffFromAPI,
    convertDayOffToAPI,
  };
}
