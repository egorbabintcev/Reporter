<template>
  <div class="reports-screen">
    <div class="reports-screen-content">
      <div class="main-section-24 flex-grow-1">
        <div class="main-row-12">
          <button
          @click="createReportHandler">
            Создать
          </button>
        </div>

        <ReportsTable/>
      </div>
    </div>

    <ManageReportPopup
    v-if="showManagePopup"/>
  </div>
</template>

<script lang="ts">
  import { computed, onBeforeMount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';

  import ReportsTable from './ReportsTable.vue';
  import ManageReportPopup from './Popups/ManageReportPopup.vue';

  export default {
    name: 'ReportsScreen',
    components: {
      ReportsTable,
      ManageReportPopup,
    },
    setup() {
      const reportApi = useReportApi();
      const reportStore = useReportStore();

      const router = useRouter();
      const route = useRoute();

      const showManagePopup = computed(() => ['create', 'edit'].includes(route.query.action as 'create' | 'edit'));

      onBeforeMount(async () => {
        const reports = await reportApi.readReports();

        reportStore.setReports(reports);
      });

      async function createReportHandler() {
        await router.push({
          query: {
            action: 'create',
          },
        });
      }

      return {
        showManagePopup,

        createReportHandler,
      };
    },
  };
</script>

<style lang="scss">
  @use '@/styles/modules/screen' as *;

  .reports-screen {
    @extend %screen;
  }

  .reports-screen-content {
    @extend %screen-content;

    padding: 16px;
  }

  .create-report-popup .popup {
    width: 600px;
    height: 700px;
  }
</style>
