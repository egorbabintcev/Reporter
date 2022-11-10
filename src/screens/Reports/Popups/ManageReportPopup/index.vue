<template>
  <Popup
  @close="closeHandler"
  @confirm="confirmHandler"
  headerText="Создать отчет"
  class="create-report-popup">
    <div class="flex flex-col flex-grow gap-6">
      <label
      for="display_name"
      class="d-inline-flex">
        <div class="flex flex-col flex-grow gap-1">
          <p class="text-base text-gray-600 font-medium">Дата:</p>

          <ManageReportPopupDatePicker
          v-model="form.date"
          :max="new Date().toISOString()"
          id="display_name"/>
        </div>
      </label>

      <div class="flex flex-row flex-nowrap gap-4">
        <label
        for="start-time"
        class="inline-flex min-w-0">
          <div class="flex flex-col flex-grow gap-1 min-w-0">
            <p class="text-base text-gray-600 font-medium">Время начала:</p>

            <InputComponent
            v-mask="{ mask: '##:##' }"
            @update:model-value="form.startTime = $event"
            :modelValue="timeStringFormatter(form.startTime)"
            placeholder="__:__"
            id="start-time"/>
          </div>
        </label>

        <label
        for="end-time"
        class="inline-flex min-w-0">
          <div class="flex flex-col flex-grow gap-1 min-w-0">
            <p class="text-base text-gray-600 font-medium">Время завершения:</p>

            <InputComponent
            v-mask="{ mask: '##:##' }"
            @update:model-value="form.endTime = $event"
            :modelValue="timeStringFormatter(form.endTime)"
            placeholder="__:__"
            id="end-time"/>
          </div>
        </label>

        <label
        for="break-time"
        class="inline-flex min-w-0">
          <div class="flex flex-col flex-grow gap-1 min-w-0">
            <p class="text-base text-gray-600 font-medium">Перерыв:</p>

            <InputComponent
            v-mask="{ mask: '##:##' }"
            @update:model-value="form.breakTime = $event"
            :modelValue="timeStringFormatter(form.breakTime)"
            placeholder="__:__"
            id="break-time"/>
          </div>
        </label>
      </div>

      <label
      for="body"
      class="inline-flex flex-grow min-w-0">
        <div class="flex flex-col flex-grow gap-1 min-w-0">
          <p class="text-base text-gray-600 font-medium">Содержание:</p>

          <textarea
          v-model="form.body"
          @keyup.shift.enter.stop
          class="
            flex-grow
            px-5 py-2.5
            min-w-0
            text-lg
            border border-gray-300
            hover:border-gray-400
            focus:border-gray-600
            active:border-gray-600
            outline-0
            rounded
            resize-none
          "
          id="body"/>
        </div>
      </label>
    </div>
  </Popup>
</template>

<script lang="ts">
  import { defineComponent, reactive, onBeforeMount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { TimeString } from '@/shared-kernel';
  import { OmittedReport, Report } from '@/core/domain/report';

  import { getDateFromTimeString, getTimeStringFromDate } from '@/core/utils/time';
  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';

  import Popup from '@/components/Popup.vue';
  import InputComponent from '@/components/Input.vue';
  import ManageReportPopupDatePicker from './DatePicker.vue';

  export default defineComponent({
    name: 'CreateReportPopup',
    components: {
      Popup,
      InputComponent,
      ManageReportPopupDatePicker,
    },
    emits: ['close'],
    setup(_, { emit }) {
      const reportApi = useReportApi();
      const reportStore = useReportStore();

      const router = useRouter();
      const route = useRoute();

      const form = reactive<Record<keyof OmittedReport, string>>({
        title: '',

        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '19:00',
        workTime: '',
        breakTime: '01:00',

        body: 'Я сделал всю работу, отпустите меня домой',
      });

      onBeforeMount(async () => {
        if (route.query.id) {
          const report = await reportApi.readReport(route.query.id as Report['id']);

          if (report) {
            form.title = report.title;

            form.date = new Date(report.date).toISOString();
            form.startTime = getTimeStringFromDate(new Date(report.startTime));
            form.endTime = getTimeStringFromDate(new Date(report.endTime));
            form.workTime = getTimeStringFromDate(new Date(report.workTime));
            form.breakTime = getTimeStringFromDate(new Date(report.breakTime));

            form.body = report.body;
          }
        }
      });

      function timeStringFormatter(string: string): TimeString {
        string = string.replace(/\D/g, '');
        let hours = string.slice(0, 2);
        let minutes = string.slice(2, 4);

        if (Number(hours) > 23) hours = '23';
        if (Number(minutes) > 59) minutes = '59';

        if (string.length > 2) string = `${hours}:${minutes}`;
        if (string.length > 5) string = string.slice(0, 5);

        return string;
      }

      function closeHandler() {
        router.push({
          query: {},
        });

        emit('close');
      }

      async function confirmHandler() {
        try {
          const newReport = {
            title: form.title,

            date: new Date(form.date).getTime(),
            startTime: getDateFromTimeString(form.startTime).getTime(),
            endTime: getDateFromTimeString(form.endTime).getTime(),
            breakTime: getDateFromTimeString(form.breakTime).getTime(),
            workTime: getDateFromTimeString(form.endTime).getTime()
              - getDateFromTimeString(form.startTime).getTime()
              - getDateFromTimeString(form.breakTime).getTime(),

            body: form.body,
          };

          if (route.query.action === 'edit') {
            await reportApi.updateReport(route.query.id as Report['id'], newReport);
          } else if (route.query.action === 'create') {
            await reportApi.createReport(newReport);
          }

          const reports = await reportApi.readReports();
          reportStore.setReports(reports);
        } finally {
          closeHandler();
        }
      }

      return {
        form,
        timeStringFormatter,
        closeHandler,
        confirmHandler,
      };
    },
  });
</script>

<style lang="scss">
  .create-report-popup .popup {
    width: 600px;
    height: 700px;
  }
</style>
