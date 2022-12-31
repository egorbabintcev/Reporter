<template>
  <input
  @input="$emit('update:modelValue', $event.target.value)"
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
  "
  :type="type"
  :value="modelValue">
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    name: 'InputComponent',
    props: {
      modelValue: {
        type: String as PropType<string>,
        required: true,
      },
      type: {
        type: String as PropType<'text'>,
        default: 'text',
      },
    },
    emits: ['update:modelValue'],
  });
</script>

<style lang="scss">

</style>
