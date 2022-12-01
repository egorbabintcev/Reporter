<template>
  <div class="section-16 editor-wrapper">
    <div class="row-12">
      <div class="report-editor__label">
        <p class="report-editor__label-text">
          Время начала
        </p>

        <a-input
        @change="form.startTime = $event.target.value"
        :value="timeStringFormatter(form.startTime)"
        size="large"
        placeholder="__:__"
        class="report-editor__input"
        allow-clear/>
      </div>

      <div class="report-editor__label">
        <p class="report-editor__label-text">
          Время окончания
        </p>

        <a-input
        @change="form.endTime = $event.target.value"
        :value="timeStringFormatter(form.endTime)"
        size="large"
        placeholder="__:__"
        class="report-editor__input"
        allow-clear/>
      </div>

      <div class="report-editor__label">
        <p class="report-editor__label-text">
          Перерыв
        </p>

        <a-input
        @change="form.breakTime = $event.target.value"
        :value="timeStringFormatter(form.breakTime)"
        size="large"
        placeholder="__:__"
        class="report-editor__input"
        allow-clear/>
      </div>
    </div>

    <div class="editor-wrapper">
      <WysiwigEditor
      @update:model-value="form.body = $event"
      :model-value="form.body"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent, reactive, PropType,
  } from 'vue';
  import WysiwigEditor from '@/components/WysiwigEditor.vue';
  import { timeStringFormatter } from '@/core/utils/time';

  import { HTMLString, TimeString } from '@/shared-kernel';

  export type TForm = {
    startTime: TimeString
    endTime: TimeString
    breakTime: TimeString
    body: HTMLString
  }

  export default defineComponent({
    name: 'ReportsEditorForm',
    components: {
      WysiwigEditor,
    },
    props: {
      modelValue: {
        type: Object as PropType<TForm>,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(props) {
      const form = reactive<TForm>(props.modelValue);

      return {
        form,
        timeStringFormatter,
      };
    },
  });
</script>

<style lang="scss">

</style>
