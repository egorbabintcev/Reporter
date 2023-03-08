<template>
  <div class="icon-container flex--dir--horizontal flex--align--center flex--justify--center">
    <span
    class="icon material-icons"
    :class="{
      'icon--size--s': size === 'small',
      'icon--size--m': size === 'medium',
      'icon--size--l': size === 'large',
    }"
    :title="title">
      {{ icon }}
    </span>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { TIconProps } from '@/components/Icon/types';

  export default defineComponent({
    name: 'IconComponent',
    props: {
      icon: {
        type: String,
        required: true,
      },
      size: {
        type: String as PropType<TIconProps['size']>,
        default: () => 'm',
      },
      title: {
        type: String,
        default: () => '',
      },
    },
  });
</script>

<style lang="scss">
  .icon-container {
    display: inline-flex;

    padding: 4px;
    width: min-content;
    height: min-content;
  }

  .icon,
  .icon--size--m {
    font-size: 22px;
  }

  .icon--size--s {
    font-size: calc(22px * 0.75);
  }

  .icon--size--l {
    font-size: calc(22px * 1.25);
  }
</style>
