import axios from 'axios';
import useEmailAdapter from '@/core/adapters/email';
import { EmailPayload } from '@/core/domain/email';

export default function useEmailApi() {
  const emailAdapter = useEmailAdapter();

  async function sendEmail(payload: EmailPayload): Promise<void> {
    await axios.post<void>(`/api/v1/send_email`, emailAdapter.convertEmailPayloadToAPI(payload));
  }

  return {
    sendEmail,
  };
}
