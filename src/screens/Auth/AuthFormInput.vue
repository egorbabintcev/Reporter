<template>
  <div
  v-bind="bind"
  class="auth-form-input">
    <el-input
    @input="$emit('update:modelValue', $event)"
    v-bind="{ ...$attrs, class: null, style: null }"
    :modelValue="modelValue"/>

    <p class="auth-form-input__error">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, HTMLAttributes } from 'vue';

  export default defineComponent({
    name: 'AuthFormInput',
    props: {
      modelValue: {
        type: String,
        default: () => '',
      },
      error: {
        type: String as PropType<string | null>,
        default: () => '',
      },
    },
    emits: ['update:modelValue'],
    computed: {
      bind() {
        return { style: this.$attrs.style, class: this.$attrs.class } as HTMLAttributes;
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
    height: 14px;
    padding: 0 8px;
    margin: 0;

    font-size: 14px;
    line-height: 1;
    color: #ff4554;
    text-align: right;
  }
</style>
