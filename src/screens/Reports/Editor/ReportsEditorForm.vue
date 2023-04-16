<template>
  <div class="reports-editor-form">
    <div class="section-16 section--grow">
      <div class="row-12">
        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время начала
          </p>

          <el-input
          @blur="form.startTime = timeStringFormatter(form.startTime)"
          @input="form.startTime = $event"
          class="reports-editor-form__input"
          :model-value="timeStringFormatter(form.startTime)"
          placeholder="__:__"
          size="large"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время окончания
          </p>

          <el-input
          @blur="form.endTime = timeStringFormatter(form.endTime)"
          @input="form.endTime = $event"
          class="reports-editor-form__input"
          :model-value="timeStringFormatter(form.endTime)"
          placeholder="__:__"
          size="large"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Перерыв
          </p>

          <el-input
          @blur="form.breakTime = timeStringFormatter(form.breakTime)"
          @input="form.breakTime = $event"
          class="reports-editor-form__input"
          :model-value="timeStringFormatter(form.breakTime)"
          placeholder="__:__"
          size="large"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время работы
          </p>

          <el-input
          class="reports-editor-form__input"
          disabled
          :model-value="form.workTime"
          placeholder="__:__"
          size="large"/>
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
    color: rgba(0 0 0 / 54%);
    font-size: 14px;
    font-weight: 700;

    margin: 0;
  }

  .reports-editor-form__input {
    flex-grow: 1;
  }

  .reports-editor-form-wysiwig {
    flex-grow: 1;
  }
</style>
