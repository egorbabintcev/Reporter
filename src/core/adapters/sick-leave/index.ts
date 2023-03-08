import convertObject from '@/core/utils/convertObject';
import {
  TCreatedSickLeave,
  TSickLeave,
  TNewSickLeave,
  TRawCreatedSickLeave,
  TRawSickLeave,
  TRawNewSickLeave,
} from '@/core/domain/sick-leave';

export default function useSickLeaveAdapter() {
  function convertSickLeaveFromApi(sickLeave: TRawSickLeave) {
    return convertObject<TRawSickLeave, TSickLeave>(sickLeave, {
      id: { key: 'id' },

      dateFrom: { callback: ({ date_from }) => date_from * 1000 },
      dateTo: { callback: ({ date_to }) => date_to * 1000 },

      description: { key: 'description' },
      status: { key: 'status' },
    });
  }

  function convertCreatedSickLeaveFromAPI(sickLeave: TRawCreatedSickLeave) {
    return convertObject<TRawCreatedSickLeave, TCreatedSickLeave>(sickLeave, {
      id: { key: 'id' },
    });
  }

  function convertSickLeaveToAPI(sickLeave: TNewSickLeave) {
    return convertObject<TNewSickLeave, TRawNewSickLeave>(sickLeave, {
      date_from: { callback: ({ dateFrom }) => dateFrom / 1000 },
      date_to: { callback: ({ dateTo }) => dateTo / 1000 },

      description: { key: 'description' },
    });
  }

  return {
    convertSickLeaveFromApi,
    convertCreatedSickLeaveFromAPI,
    convertSickLeaveToAPI,
  };
}
