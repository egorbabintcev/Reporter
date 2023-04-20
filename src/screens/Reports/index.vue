<template>
  <div class="reports-screen">
    <reports-sidebar/>

    <reports-editor/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import ReportsEditor from './Editor/index.vue';
  import ReportsSidebar from './Sidebar/index.vue';

  export default defineComponent({
    name: 'ReportsScreen',
    components: {
      ReportsEditor,
      ReportsSidebar,
    },
  });
</script>

<style lang="scss">
  .reports-screen {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
  }
</style>
