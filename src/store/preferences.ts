import { defineStore } from 'pinia';

type Preferences = {
  sidebarPosition: 'left' | 'right'
};

type State = {
  preferences: Preferences
};

const usePreferencesStore = defineStore('preferences', {
  state: (): State => ({
    preferences: localStorage.getItem('ReporterPreferences')
      ? JSON.parse(localStorage.getItem('ReporterPreferences') as string)
      : {
        sidebarPosition: 'left',
      },
  }),
  actions: {
    setPreferences(value: Partial<Preferences>) {
      Object.assign(this.preferences, value);

      localStorage.setItem('ReporterPreferences', JSON.stringify(this.preferences));
    },
  },
});

export default usePreferencesStore;
