<template>
  <div
  class="reports-screen flex--dir--horizontal flex--grow">
    <reports-sidebar/>

    <reports-card/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import ReportsSidebar from '@/components/ReportsSidebar/index.vue';
  import ReportsCard from '@/components/ReportsCard/index.vue';

  export default defineComponent({
    name: 'ReportsScreen',
    components: {
      ReportsCard,
      ReportsSidebar,
    },
  });
</script>

<style lang="scss">

</style>
