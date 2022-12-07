<template>
  <div class="reports-editor-form">
    <div class="section-16 section--grow">
      <div class="row-12">
        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время начала
          </p>

          <a-input
          @change="form.startTime = $event.target.value"
          @blur="form.startTime = timeStringFormatter(form.startTime)"
          :value="timeStringFormatter(form.startTime)"
          size="large"
          placeholder="__:__"
          class="reports-editor-form__input"
          allow-clear/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время окончания
          </p>

          <a-input
          @change="form.endTime = $event.target.value"
          :value="timeStringFormatter(form.endTime)"
          size="large"
          placeholder="__:__"
          class="reports-editor-form__input"
          allow-clear/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Перерыв
          </p>

          <a-input
          @change="form.breakTime = $event.target.value"
          :value="timeStringFormatter(form.breakTime)"
          size="large"
          placeholder="__:__"
          class="reports-editor-form__input"
          allow-clear/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время работы
          </p>

          <a-input
          :value="form.workTime"
          size="large"
          placeholder="__:__"
          class="reports-editor-form__input"
          disabled/>
        </div>
      </div>

      <div class="reports-editor-form-wysiwig">
        <WysiwigEditor
        v-model="form.body"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  import { getDateFromTimeString, getTimeStringFromDate, timeStringFormatter } from '@/core/utils/time';
  import useReportStore from '@/core/store/report';
  import useForm from './useForm';

  import WysiwigEditor from '@/components/WysiwigEditor.vue';

  export default defineComponent({
    name: 'ReportsEditorForm',
    components: {
      WysiwigEditor,
    },
    setup() {
      const reportStore = useReportStore();
      const {
        report,
      } = storeToRefs(reportStore);

      const { form } = useForm();

      watch(
        report,
        () => {
          if (report.value) {
            form.startTime = getTimeStringFromDate(new Date(report.value.startTime));
            form.endTime = getTimeStringFromDate(new Date(report.value.endTime));
            form.breakTime = getTimeStringFromDate(new Date(report.value.breakTime));
            form.workTime = getTimeStringFromDate(new Date(report.value.workTime));

            form.body = report.value.body;
          }
        },
        {
          immediate: true,
        },
      );

      watch(form, () => {
        form.workTime = getTimeStringFromDate(new Date(
          getDateFromTimeString(form.endTime).getTime()
            - getDateFromTimeString(form.startTime).getTime()
            - getDateFromTimeString(form.breakTime).getTime(),
        ));
      });

      return {
        form,
        timeStringFormatter,
      };
    },
  });
</script>

<style lang="scss">
  .reports-editor-form {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    padding: 16px;
  }

  .reports-editor-form-label {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    gap: 6px;
  }

  .reports-editor-form-label__text {
    margin: 0;
  }

  .reports-editor-form__input {
    flex-grow: 1;
  }

  .reports-editor-form-wysiwig {
    flex-grow: 1;
  }
</style>
