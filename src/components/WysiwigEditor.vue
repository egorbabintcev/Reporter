<template>
  <div
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
          });

          editorInstance?.on('change', () => {
            context.emit('update:modelValue', editorInstance?.getHTML() ?? '');
          });

          watch(modelValue, (value, oldValue) => {
            if (value !== oldValue && value !== editorInstance?.getHTML()) {
              editorInstance?.setHTML(modelValue.value);
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
  .toastui-editor-contents h3 {
    margin-bottom: 12px;
  }
</style>
