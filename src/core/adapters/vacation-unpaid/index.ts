import convertObject from '@/core/utils/convertObject';
import {
  TCreatedVacationUnpaid,
  TVacationUnpaid,
  TNewVacationUnpaid,
  TRawCreatedVacationUnpaid,
  TRawVacationUnpaid,
  TRawNewVacationUnpaid,
} from '@/core/domain/vacation-unpaid';

export default function useVacationUnpaidAdapter() {
  function convertVacationUnpaidFromApi(vacation: TRawVacationUnpaid) {
    return convertObject<TRawVacationUnpaid, TVacationUnpaid>(vacation, {
      id: { key: 'id' },

      dateFrom: { callback: ({ date_from }) => date_from * 1000 },
      dateTo: { callback: ({ date_to }) => date_to * 1000 },

      description: { key: 'description' },
      status: { key: 'status' },
    });
  }

  function convertCreatedVacationUnpaidFromAPI(vacation: TRawCreatedVacationUnpaid) {
    return convertObject<TRawCreatedVacationUnpaid, TCreatedVacationUnpaid>(vacation, {
      id: { key: 'id' },
    });
  }

  function convertVacationUnpaidToAPI(vacation: TNewVacationUnpaid) {
    return convertObject<TNewVacationUnpaid, TRawNewVacationUnpaid>(vacation, {
      date_from: { callback: ({ dateFrom }) => dateFrom / 1000 },
      date_to: { callback: ({ dateTo }) => dateTo / 1000 },

      description: { key: 'description' },
    });
  }

  return {
    convertVacationUnpaidFromApi,
    convertCreatedVacationUnpaidFromAPI,
    convertVacationUnpaidToAPI,
  };
}
