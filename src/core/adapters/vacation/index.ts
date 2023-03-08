import convertObject from '@/core/utils/convertObject';
import {
  TCreatedVacation,
  TVacation,
  TNewVacation,
  TRawCreatedVacation,
  TRawVacation,
  TRawNewVacation,
} from '@/core/domain/vacation';

export default function useVacationAdapter() {
  function convertVacationFromApi(vacation: TRawVacation) {
    return convertObject<TRawVacation, TVacation>(vacation, {
      id: { key: 'id' },

      dateFrom: { callback: ({ date_from }) => date_from * 1000 },
      dateTo: { callback: ({ date_to }) => date_to * 1000 },

      description: { key: 'description' },
      status: { key: 'status' },

      isPaid: { key: 'is_paid' },
    });
  }

  function convertCreatedVacationFromAPI(vacation: TRawCreatedVacation) {
    return convertObject<TRawCreatedVacation, TCreatedVacation>(vacation, {
      id: { key: 'id' },
    });
  }

  function convertVacationToAPI(vacation: TNewVacation) {
    return convertObject<TNewVacation, TRawNewVacation>(vacation, {
      date_from: { callback: ({ dateFrom }) => dateFrom / 1000 },
      date_to: { callback: ({ dateTo }) => dateTo / 1000 },

      description: { key: 'description' },

      is_paid: { key: 'isPaid' },
    });
  }

  return {
    convertVacationFromApi,
    convertCreatedVacationFromAPI,
    convertVacationToAPI,
  };
}
