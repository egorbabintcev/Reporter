<template>
  <input
  @input="$emit('update:modelValue', $event.target.value)"
  :value="modelValue"
  :type="type"
  class="
    px-5 py-2.5
    min-w-0
    text-lg
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
  });
</script>

<style lang="scss">

</style>
