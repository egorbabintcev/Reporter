<template>
  <div
  v-bind="{ style: $attrs.style, class: $attrs.class }"
  class="inline-flex flex-col gap-0.5 w-full">
    <input
    v-bind="{ ...$attrs, class: null, style: null }"
    @input="$emit('update:modelValue', $event.target.value)"
    :value="modelValue"
    class="
      text-base
      text-gray-900
      font-medium

      w-full
      py-2.5
      px-4

      border
      border-solid
      outline-0
      rounded-xl
    "
    :class="{
      'border-red-600 text-red-600': !!error,
      'border-violet-500 placeholder-shown:text-gray-400': !error,
    }">

    <p class="text-right text-sm text-red-600 h-4 px-2">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AuthFormInput',
    emits: ['update:modelValue'],
    props: {
      modelValue: {
        type: String,
        default: () => '',
      },
      error: {
        type: String,
        default: () => null,
      },
    },
  });
</script>

<style lang="scss">

</style>
