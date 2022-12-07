<template>
  <div
  ref="wysiwig-editor"
  class="wisywig-editor"/>
</template>

<script lang="ts">
  import {
    defineComponent,
    onMounted,
    PropType,
    ref, toRefs,
    watch,
  } from 'vue';
  import Editor from '@toast-ui/editor';

  import { HTMLString } from '@/shared-kernel';

  export default defineComponent({
    name: 'WysiwigEditor',
    props: {
      modelValue: {
        type: String as PropType<HTMLString>,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(props, context) {
      const editorElement = ref<HTMLDivElement | null>(null);
      let editorInstance: Editor | null = null;

      const {
        modelValue,
      } = toRefs(props);

      onMounted(() => {
        if (editorElement.value) {
          editorInstance = new Editor({
            el: editorElement.value,
            height: '100%',
            initialEditType: 'markdown',
            initialValue: modelValue.value ?? '',
            previewStyle: 'tab',
            usageStatistics: false,
            extendedAutolinks: true,
            hideModeSwitch: true,
          });

          editorInstance?.on('change', () => {
            context.emit('update:modelValue', editorInstance?.getMarkdown() ?? '');
          });

          watch(modelValue, (value, oldValue) => {
            if (value !== oldValue && value !== editorInstance?.getMarkdown()) {
              editorInstance?.setMarkdown(modelValue.value);
            }
          });
        }
      });

      return {
        'wysiwig-editor': editorElement,
      };
    },
  });
</script>

<style lang="scss">
  .wisywig-editor {
    .toastui-editor-contents,
    .ProseMirror {
      font-size: 16px !important;
      font-family: 'Segoe UI', 'Roboto', sans-serif !important;
    }

    .toastui-editor-contents {
      h3 {
        margin-bottom: 12px;
      }
    }

    .toastui-editor-defaultUI {
      font-family: 'Segoe UI', 'Roboto', sans-serif !important;
    }
  }
</style>
