import { defineStore } from 'pinia';
import { ref } from 'vue';
import Bowser from 'bowser';

export default function useClientStore(storeId = 'client') {
  return defineStore(storeId, () => {
    const { userAgent } = window.navigator;
    const { browser } = Bowser.parse(userAgent);

    const browserInfo = ref({
      browser,
      isSafari: browser.name === 'Safari',
    });

    return {
      browserInfo,
    };
  })();
}
