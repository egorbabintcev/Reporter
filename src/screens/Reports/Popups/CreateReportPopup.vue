<template>
  <Popup
  @close="$emit('close')"
  @confirm="confirmCreateHandler"
  headerText="Создать отчет"
  class="create-report-popup">
    <div class="flex-grow-1 main-section-32">
      <label
      for="display_name"
      class="d-inline-flex">
        <div class="flex-grow-1 main-section-4">
          <p>Название:</p>

          <input
          v-model="form.title"
          type="text"
          class="main-text-field"
          id="display_name">
        </div>
      </label>

      <div class="main-row-16">
        <label
        for="start-time"
        class="d-inline-flex flex-grow-1">
          <div class="flex-grow-1 main-section-4">
            <p>Время начала:</p>

            <input
            v-mask="{ mask: '##:##' }"
            @input="form.startTime = $event.target.value"
            :value="timeStringFormatter(form.startTime)"
            type="text"
            class="main-text-field">
          </div>
        </label>

        <label
        for="end-time"
        class="d-inline-flex flex-grow-1">
          <div class="flex-grow-1 main-section-4">
            <p>Время завершения:</p>

            <input
            v-mask="{ mask: '##:##' }"
            @input="form.endTime = $event.target.value"
            :value="timeStringFormatter(form.endTime)"
            type="text"
            class="main-text-field"
            id="end-time">
          </div>
        </label>

        <label
        for="break-duration"
        class="d-inline-flex flex-grow-1">
          <div class="flex-grow-1 main-section-4">
            <p>Перерыв:</p>

            <input
            v-mask="{ mask: '##:##' }"
            @input="form.breakTime = $event.target.value"
            :value="timeStringFormatter(form.breakTime)"
            type="text"
            class="main-text-field"
            id="break-duration">
          </div>
        </label>
      </div>

      <label
      for="body"
      class="d-inline-flex flex-grow-1">
        <div class="flex-grow-1 main-section-4">
          <p>Содержание:</p>

          <textarea
          v-model="form.body"
          class="main-text-area flex-grow-1"
          id="body"/>
        </div>
      </label>
    </div>
  </Popup>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { TimeString } from '@/shared-kernel';
  import { OmittedReport } from '@/core/domain/report';

  import { getDateFromTimeString, getDateStringFromDate } from '@/core/utils/time';
  import useReportApi from '@/core/api/report';

  import Popup from '@/components/Popup.vue';

  export default defineComponent({
    name: 'CreateReportPopup',
    components: {
      Popup,
    },
    emits: ['close'],
    setup(_, { emit }) {
      const reportApi = useReportApi();

      const form = reactive<Record<keyof OmittedReport, string>>({
        title: `Отчет за ${getDateStringFromDate(new Date())}`,

        startTime: '10:00',
        endTime: '19:00',
        workTime: '',
        breakTime: '01:00',

        body: 'Я сделал всю работу, отпустите меня домой',
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

      async function confirmCreateHandler() {
        try {
          await reportApi.createReport({
            title: form.title,

            startTime: getDateFromTimeString(form.startTime).getTime(),
            endTime: getDateFromTimeString(form.endTime).getTime(),
            breakTime: getDateFromTimeString(form.breakTime).getTime(),
            workTime: getDateFromTimeString(form.endTime).getTime()
              - getDateFromTimeString(form.startTime).getTime()
              - getDateFromTimeString(form.breakTime).getTime(),

            body: form.body,
          });
        } finally {
          emit('close');
        }
      }

      return {
        form,
        timeStringFormatter,
        confirmCreateHandler,
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
