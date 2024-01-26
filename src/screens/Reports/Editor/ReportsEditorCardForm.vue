<template>
  <div class="reports-editor-form">
    <div class="section-16 section--grow">
      <div class="row-12">
        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время начала
          </p>

          <el-input
          @update:model-value="$emit('update:startTime', $event)"
          class="reports-editor-form__input"
          :formatter="timeStringFormatter"
          :model-value="startTime"
          placeholder="__:__"
          size="large"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время окончания
          </p>

          <el-input
          @update:model-value="$emit('update:endTime', $event)"
          class="reports-editor-form__input"
          :formatter="timeStringFormatter"
          :model-value="endTime"
          placeholder="__:__"
          size="large"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Перерыв
          </p>

          <el-input
          @update:model-value="$emit('update:breakTime', $event)"
          class="reports-editor-form__input"
          :formatter="timeStringFormatter"
          :model-value="breakTime"
          placeholder="__:__"
          size="large"/>
        </div>

        <div class="reports-editor-form-label">
          <p class="reports-editor-form-label__text">
            Время работы
          </p>

          <el-input
          @update:model-value="$emit('update:workTime', $event)"
          class="reports-editor-form__input"
          disabled
          :model-value="workTime"
          placeholder="__:__"
          size="large"/>
        </div>
      </div>

      <div class="reports-editor-form-wysiwig">
        <WysiwigEditor
        @update:model-value="$emit('update:body', $event)"
        :model-value="body"
        placeholder="Напишите сюда о результатах и планах работы"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { timeStringFormatter } from '@/utils/time';

  import WysiwigEditor from '@/components/WysiwigEditor.vue';

  export default defineComponent(
    {
      name: 'ReportsEditorForm',
      components: {
        WysiwigEditor,
      },
      props: {
        startTime: {
          type: String as PropType<string>,
          default: () => '',
        },
        endTime: {
          type: String as PropType<string>,
          default: () => '',
        },
        breakTime: {
          type: String as PropType<string>,
          default: () => '',
        },
        workTime: {
          type: String as PropType<string>,
          default: () => '',
        },
        body: {
          type: String as PropType<string>,
          default: () => '',
        },
      },
      emits: ['update:startTime', 'update:endTime', 'update:breakTime', 'update:workTime', 'update:body'],
      setup() {
        return {
          timeStringFormatter,
        };
      },
    },
  );
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
