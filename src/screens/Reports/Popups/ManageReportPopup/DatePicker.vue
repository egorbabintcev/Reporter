<template>
  <input
  @input="inputHandler($event.target.value)"
  :value="getDateInputStringFromString(modelValue)"
  :max="getDateInputStringFromString(max)"
  :min="getDateInputStringFromString(min)"
  type="date"
  class="
    px-4 py-2
    min-w-0
    text-base
    border border-gray-300
    enabled:hover:border-gray-400
    enabled:focus:border-gray-600
    enabled:active:border-gray-600
    disabled:opacity-75
    outline-0
    rounded
  ">
</template>

<script lang="ts">
  import {
    defineComponent,
    PropType,
    onMounted,
  } from 'vue';

  import { ISODateTimeString } from '@/shared-kernel';

  type DateInputString = string;

  export default defineComponent({
    name: 'ManageReportPopupDatePicker',
    props: {
      modelValue: {
        type: String as PropType<ISODateTimeString | null>,
        default: () => '',
      },
      max: {
        type: String as PropType<ISODateTimeString | null>,
        default: () => null,
      },
      min: {
        type: String as PropType<ISODateTimeString | null>,
        default: () => null,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      function getDateInputStringFromString(string: ISODateTimeString): DateInputString {
        if (!string) return '';

        const date = new Date(string);

        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
      }

      function inputHandler(value: DateInputString) {
        if (!value) {
          emit('update:modelValue', '');
          return;
        }

        const date = new Date(value);

        date.setUTCMilliseconds(0);
        date.setUTCSeconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(0);

        emit('update:modelValue', date.toISOString());
      }

      onMounted(() => {
        inputHandler(props.modelValue ?? '');
      });

      return {
        getDateInputStringFromString,
        inputHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
