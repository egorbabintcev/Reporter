<template>
  <div
  v-bind="{ style: $attrs.style, class: $attrs.class }"
  class="auth-form-input">
    <a-input
    @change="$emit('update:modelValue', $event.target.value)"
    v-bind="{ ...$attrs, class: null, style: null }"
    :value="modelValue"/>

    <p class="auth-form-input__error">
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
  .auth-form-input {
    display: inline-flex;
    flex-flow: column nowrap;
    gap: 4px;

    width: 100%;
  }

  .auth-form-input__error {
    color: #ff4554;
    font-size: 14px;
    text-align: right;
    line-height: 1;

    height: 14px;
    padding: 0 8px;
    margin: 0;
  }
</style>
