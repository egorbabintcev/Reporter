<template>
  <div class="reports-editor">
    <reports-editor-card
    v-if="hasReport"
    :report-id="($route.query.report_id as string)"/>

    <reports-editor-blank
    v-else/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from 'vue-router';

  import ReportsEditorCard from './ReportsEditorCard.vue';
  import ReportsEditorBlank from './ReportsEditorBlank.vue';

  export default defineComponent({
    name: 'ReportsEditor',
    components: {
      ReportsEditorCard,
      ReportsEditorBlank,
    },
    setup() {
      const route = useRoute();

      const hasReport = computed(() => !!route.query.report_id);

      return {
        hasReport,
      };
    },
  });
</script>

<style lang="scss">
  .reports-editor {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
  }
</style>
