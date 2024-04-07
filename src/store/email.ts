import { defineStore } from 'pinia';

import { EmailApi } from '@/services/api.ts';

const useEmailStore = defineStore('email', () => {
  async function sendEmail(...args: Parameters<typeof EmailApi.sendEmail>) {
    await EmailApi.sendEmail(...args);
  }

  return {
    sendEmail,
  };
});

export default useEmailStore;
