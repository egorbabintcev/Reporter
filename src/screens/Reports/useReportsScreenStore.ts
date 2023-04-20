import { defineStore } from 'pinia';
import dayjs, { Dayjs } from 'dayjs';

type State = {
    selectedDate: Dayjs
}

export default function useReportsScreenStore() {
    return defineStore('screen-reports', {
        state: (): State => ({
            selectedDate: dayjs(),
        }),
    })();
}
