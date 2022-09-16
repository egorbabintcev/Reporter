import { reactive, readonly } from 'vue';

type showPopupsState = {
  createReportPopup: boolean
}

const state = reactive<showPopupsState>({
  createReportPopup: false,
});

export default function useShowPopups() {
  return {
    showPopups: readonly<showPopupsState>(state),
    setShowPopup(
      name: keyof showPopupsState,
      value: showPopupsState[keyof showPopupsState],
    ) {
    state[name] = value;
    },
  };
}
