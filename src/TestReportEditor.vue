<template>
  <div class="report-editor">
    <div class="report-editor__header">
      <a-button type="primary">
        <template #icon>
          <arrow-left-outlined/>
        </template>
      </a-button>

      <p class="report-editor__header-title">
        Отчет за 30.11.2022
      </p>

      <div class="report-editor__header-spacer"/>

      <div class="report-editor__header-controls">
        <a-button
        type="outlined"
        size="large">
          <template #icon>
            <save-filled/>
          </template>
        </a-button>

        <a-button
        type="outlined"
        size="large">
          <template #icon>
            <copy-filled/>
          </template>
        </a-button>

        <a-button
        type="outlined"
        size="large">
          <template #icon>
            <mail-filled/>
          </template>
        </a-button>

        <a-button
        type="outlined"
        size="large"
        danger>
          <template #icon>
            <delete-filled/>
          </template>
        </a-button>
      </div>
    </div>

    <div class="report-editor__content">
      <div class="section-16 editor-wrapper">
        <div class="row-12">
          <div class="report-editor__label">
            <p class="report-editor__label-text">
              Дата отчета
            </p>

            <a-date-picker
            size="large"
            placeholder="Выберите дату"
            class="report-editor__input"/>
          </div>

          <div class="report-editor__label">
            <p class="report-editor__label-text">
              Время начала
            </p>

            <a-time-picker
            size="large"
            format="HH:ss"
            placeholder="Выберите время"
            class="report-editor__input"/>
          </div>

          <div class="report-editor__label">
            <p class="report-editor__label-text">
              Время окончания
            </p>

            <a-time-picker
            size="large"
            format="HH:ss"
            placeholder="Выберите время"
            class="report-editor__input"/>
          </div>

          <div class="report-editor__label">
            <p class="report-editor__label-text">
              Перерыв
            </p>

            <a-time-picker
            size="large"
            format="HH:ss"
            placeholder="Выберите время"
            class="report-editor__input"/>
          </div>
        </div>

        <div class="editor-wrapper">
          <div
          ref="editor"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import {
    ArrowLeftOutlined,
    SaveFilled,
    CopyFilled,
    DeleteFilled,
    MailFilled,
  } from '@ant-design/icons-vue';
  import Editor from '@toast-ui/editor';

  export default defineComponent({
    name: 'TestReportEditor',
    components: {
      ArrowLeftOutlined,
      SaveFilled,
      CopyFilled,
      DeleteFilled,
      MailFilled,
    },
    setup() {
      const editorElement = ref<HTMLDivElement | null>(null);
      let editorInstance: Editor | null = null;

      onMounted(() => {
        if (editorElement.value) {
          editorInstance = new Editor({
            el: editorElement.value,
            height: '100%',
            initialEditType: 'markdown',
            previewStyle: 'tab',
            usageStatistics: false,
          });
        }
      });

      return {
        editor: editorElement,
      };
    },
  });
</script>

<style lang="scss">
.report-editor {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
}

.report-editor__header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 16px;

  padding: 16px;

  border-bottom: 1px solid rgba(0 0 0 / 14%);
}

.report-editor__header-title {
  font-size: 22px;
  font-weight: 500;

  margin: 0;
}

.report-editor__header-spacer {
  flex-grow: 1;
}

.report-editor__header-controls {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 12px;
}

.report-editor__content {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;

  padding: 16px;
}

.report-editor__label {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  gap: 6px;
}

.report-editor__label-text {
  margin: 0;
}

.report-editor__input {
  flex-grow: 1;
}

.editor-wrapper {
  flex-grow: 1;

  .toastui-editor-defaultUI {
    font-family: 'Segoe UI', 'Roboto', sans-serif !important;
  }

  .toastui-editor-contents,
  .ProseMirror {
    font-size: 16px !important;
    font-family: 'Segoe UI', 'Roboto', sans-serif !important;
  }
}
</style>
