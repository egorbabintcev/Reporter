<template>
  <div class="reports-editor-form">
    <div class="section-16 section--grow">
      <div class="row-12">
        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время начала
          </p>

          <a-input
          @blur="form.startTime = timeStringFormatter(form.startTime)"
          @change="form.startTime = $event.target.value"
          allow-clear
          class="reports-editor-form__input"
          placeholder="__:__"
          size="large"
          :value="timeStringFormatter(form.startTime)"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время окончания
          </p>

          <a-input
          @change="form.endTime = $event.target.value"
          allow-clear
          class="reports-editor-form__input"
          placeholder="__:__"
          size="large"
          :value="timeStringFormatter(form.endTime)"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Перерыв
          </p>

          <a-input
          @change="form.breakTime = $event.target.value"
          allow-clear
          class="reports-editor-form__input"
          placeholder="__:__"
          size="large"
          :value="timeStringFormatter(form.breakTime)"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время работы
          </p>

          <a-input
          class="reports-editor-form__input"
          disabled
          placeholder="__:__"
          size="large"
          :value="form.workTime"/>
        </div>
      </div>

      <div class="reports-editor-form-wysiwig">
        <WysiwigEditor
        v-model="form.body"
        placeholder="Напишите сюда о результатах и планах работы"/>
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
        (value, oldValue) => {
          if (value && value?.id !== oldValue?.id) {
            const {
              startTime,
              endTime,
              breakTime,
              workTime,
              body,
            } = value;

            form.startTime = startTime > 0 ? getTimeStringFromDate(new Date(startTime)) : '';
            form.endTime = endTime > 0 ? getTimeStringFromDate(new Date(endTime)) : '';
            form.breakTime = breakTime > 0 ? getTimeStringFromDate(new Date(breakTime)) : '';
            form.workTime = workTime > 0 ? getTimeStringFromDate(new Date(workTime)) : '';

            form.body = body;
          }
        },
        {
          immediate: true,
        },
      );

      watch(form, () => {
        if (form.startTime && form.endTime) {
          const diff = new Date(
            getDateFromTimeString(form.endTime).getTime()
              - getDateFromTimeString(form.startTime).getTime()
              - getDateFromTimeString(form.breakTime).getTime(),
          );

          form.workTime = diff.getTime() < 0
            ? ''
            : getTimeStringFromDate(diff);
        } else {
          form.workTime = '';
        }
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
