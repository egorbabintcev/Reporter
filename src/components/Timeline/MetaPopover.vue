<template>
  <a-popover
  v-if="meta"
  :title="meta.title">
    <template #content>
      <div v-html="meta.description"/>
    </template>

    <slot/>
  </a-popover>

  <slot
  v-else/>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { TTimelineEvent } from '@/components/Timeline/types';

  export default defineComponent({
    name: 'MetaPopover',
    props: {
      meta: {
        type: Object as PropType<TTimelineEvent['meta']>,
        default: () => null,
      },
    },
  });
</script>

<style lang="scss">

</style>
