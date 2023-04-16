import convertObject from '@/core/utils/convertObject';
import {
  TCreatedVacationPaid,
  TVacationPaid,
  TNewVacationPaid,
  TRawCreatedVacationPaid,
  TRawVacationPaid,
  TRawNewVacationPaid,
} from '@/core/domain/vacation-paid';

export default function useVacationPaidAdapter() {
  function convertVacationPaidFromApi(vacation: TRawVacationPaid) {
    return convertObject<TRawVacationPaid, TVacationPaid>(vacation, {
      id: { key: 'id' },

      dateFrom: { callback: ({ date_from }) => date_from * 1000 },
      dateTo: { callback: ({ date_to }) => date_to * 1000 },

      description: { key: 'description' },
      status: { key: 'status' },
    });
  }

  function convertCreatedVacationPaidFromAPI(vacation: TRawCreatedVacationPaid) {
    return convertObject<TRawCreatedVacationPaid, TCreatedVacationPaid>(vacation, {
      id: { key: 'id' },
    });
  }

  function convertVacationPaidToAPI(vacation: TNewVacationPaid) {
    return convertObject<TNewVacationPaid, TRawNewVacationPaid>(vacation, {
      date_from: { callback: ({ dateFrom }) => dateFrom / 1000 },
      date_to: { callback: ({ dateTo }) => dateTo / 1000 },

      description: { key: 'description' },
    });
  }

  return {
    convertVacationPaidFromApi,
    convertCreatedVacationPaidFromAPI,
    convertVacationPaidToAPI,
  };
}
