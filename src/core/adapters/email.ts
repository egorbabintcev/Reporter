import { EmailPayload, RawEmailPayload } from '@/core/domain/email';
import convertObject from '@/core/utils/convertObject';

export default function useEmailAdapter() {
  function convertEmailPayloadToAPI(payload: EmailPayload) {
    return convertObject<EmailPayload, RawEmailPayload>(payload, {
      email: { key: 'email' },
      password: { key: 'password' },
      recipients: { key: 'recipients' },
      subject: { key: 'subject' },
      body: { key: 'body' },
    });
  }

  return {
    convertEmailPayloadToAPI,
  };
}
