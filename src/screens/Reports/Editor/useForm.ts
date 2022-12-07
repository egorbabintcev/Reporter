import { reactive } from 'vue';

const form = reactive({
  startTime: '',
  endTime: '',
  breakTime: '',
  workTime: '',
  body: '',
});
export default function useForm() {
  return {
    form,
  };
}
