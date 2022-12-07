<template>
  <div class="reports-editor">
    <template
    v-if="route.query.id">
      <ReportsEditorHeader/>

      <ReportsEditorToolbar/>

      <ReportsEditorForm/>
    </template>

    <ReportsEditorBlank
    v-else/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import useReportApi from '@/core/api/report';

  import useReportStore from '@/core/store/report';

  import ReportsEditorHeader from './ReportsEditorHeader.vue';
  import ReportsEditorToolbar from './ReportsEditorToolbar.vue';
  import ReportsEditorForm from './ReportsEditorForm.vue';
  import ReportsEditorBlank from './ReportsEditorBlank.vue';

  export default defineComponent({
    name: 'ReportsEditor',
    components: {
      ReportsEditorHeader,
      ReportsEditorToolbar,
      ReportsEditorForm,
      ReportsEditorBlank,
    },
    setup() {
      const route = useRoute();

      const reportApi = useReportApi();

      const reportStore = useReportStore();

      watch(
        route,
        async () => {
          if (route.params.id) {
            const report = await reportApi.readReport(route.params.id as string);

            reportStore.setReport(report);
          }
        },
        {
          immediate: true,
        },
      );

      return {
        route,
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
