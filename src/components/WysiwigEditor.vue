<template>
  <div
  @keydown="shortcutsHandler"
  class="wisywig-editor"
  ref="wysiwig-editor"/>
</template>

<script lang="ts">
  import {
    defineComponent,
    onMounted,
    PropType,
    ref, toRefs,
    watch,
  } from 'vue';
  import Editor, { EditorOptions } from '@toast-ui/editor';

  import { HTMLString } from '@/shared-kernel';

  import useTheme from '@/hooks/useTheme.ts';

  export default defineComponent({
    name: 'WysiwigEditor',
    props: {
      modelValue: {
        type: String as PropType<HTMLString>,
        required: true,
      },
      placeholder: {
        type: String as PropType<string>,
        default: () => '',
      },
    },
    emits: ['update:modelValue'],
    setup(props, context) {
      const editorElement = ref<HTMLDivElement | null>(null);
      let editorInstance: Editor | null = null;

      const {
        modelValue,
        placeholder,
      } = toRefs(props);

      const { theme } = useTheme();

      let isBlocked = false;

      function createEditorInstance() {
        if (editorElement.value) {
          const editorOptions: EditorOptions = {
            el: editorElement.value,
            height: '100%',
            initialEditType: 'markdown',
            initialValue: modelValue.value ?? '',
            previewStyle: 'tab',
            usageStatistics: false,
            extendedAutolinks: true,
            hideModeSwitch: true,
            placeholder: placeholder.value,
            previewHighlight: false,
          };

          if (theme.value === 'dark') {
            editorOptions.theme = 'dark';
          }

          if (editorInstance) {
            editorInstance.destroy();
          }

          editorInstance = new Editor(editorOptions);

          editorInstance?.on('change', () => {
            if (isBlocked) return;
            context.emit('update:modelValue', editorInstance?.getMarkdown() ?? '');
          });
        }
      }

      watch(theme, () => {
        createEditorInstance();
      });

      watch(modelValue, (value, oldValue) => {
        if (value !== oldValue && value !== editorInstance?.getMarkdown()) {
          isBlocked = true;
          editorInstance?.setMarkdown(modelValue.value, false);
          isBlocked = false;
        }
      });

      onMounted(() => {
        createEditorInstance();
      });

      // TODO: pls, refactor naming in this shit
      function shortcutsHandler(event: KeyboardEvent) {
        if (!editorInstance) return;

        // handle non shift keys
        if (!event.shiftKey) {
          // handle ctrl+k
          if (event.ctrlKey && event.code === 'KeyK') {
            event.preventDefault();

            const selectedText = editorInstance.getSelectedText();
            editorInstance.exec('addLink', {
              linkText: selectedText && 'text',
              linkUrl: selectedText || 'url',
            });

            const selection = editorInstance.getSelection();
            const selectionEnd = selection[1];

            if (Array.isArray(selectionEnd)) {
              const [endLineOffset, endCursorOffset] = selectionEnd;

              if (selectedText) {
                const { range } = editorInstance.getRangeInfoOfNode([endLineOffset, endCursorOffset - 8 - selectedText.length]);
                const rangeSelectionStart = range[0];

                if (Array.isArray(rangeSelectionStart)) {
                  const [startLineOffset, startCursorOffset] = rangeSelectionStart;

                  editorInstance.setSelection([startLineOffset, startCursorOffset + 1], [startLineOffset, startCursorOffset + 5]);
                }
              } else {
                const { range } = editorInstance.getRangeInfoOfNode([endLineOffset, endCursorOffset - 5]);

                const rangeSelectionEnd = range[1];

                if (Array.isArray(rangeSelectionEnd)) {
                  const [rangeEndLineOffset, rangeEndCursorOffset] = rangeSelectionEnd;

                  editorInstance.setSelection([rangeEndLineOffset, rangeEndCursorOffset - 4], [rangeEndLineOffset, rangeEndCursorOffset - 1]);
                }
              }
            }
          }
        }
      }

      return {
        'wysiwig-editor': editorElement,

        shortcutsHandler,
      };
    },
  });
</script>

<style lang="scss">
  /* stylelint-disable selector-class-pattern */
  .wisywig-editor {
    .toastui-editor-contents,
    .ProseMirror {
      font-family: 'Segoe UI', Roboto, sans-serif !important;
      font-size: 16px !important;
    }

    .toastui-editor-contents {
      h3 {
        margin-bottom: 12px;
      }
    }

    .toastui-editor-defaultUI {
      font-family: 'Segoe UI', Roboto, sans-serif !important;
    }
  }
</style>
