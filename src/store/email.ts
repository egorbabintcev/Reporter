import { defineStore } from 'pinia';
import httpClient from '@/transport/http.ts';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace EmailApi {
  type SendMailRequest = {
    email: string
    password: string
    recipients: string[]
    subject: string
    body: string
  };
  type SendMailResponse = void;

  export async function sendEmail(request: SendMailRequest): Promise<SendMailResponse> {
    const requestUrl = `/api/v1/send_email`;

    await httpClient.post<SendMailResponse>(requestUrl, request);
  }
}

const useEmailStore = defineStore('email', () => {
  async function sendEmail(...args: Parameters<typeof EmailApi.sendEmail>) {
    await EmailApi.sendEmail(...args);
  }

  return {
    sendEmail,
  };
});

export default useEmailStore;
