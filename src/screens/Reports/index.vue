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
    v-if="showPopups.createReportPopup"
    @close="setShowPopup('createReportPopup', false)"/>
  </div>
</template>

<script lang="ts">
  import { useRouter } from 'vue-router';

  import ReportsTable from './ReportsTable.vue';
  import ManageReportPopup from './Popups/ManageReportPopup.vue';

  import useReportService from '@/core/service/report';
  import useShowPopups from './useShowPopups';

  export default {
    name: 'ReportsScreen',
    components: {
      ReportsTable,
      ManageReportPopup,
    },
    setup() {
      const {
        reports,
        readReports,
      } = useReportService();

      const {
        showPopups,
        setShowPopup,
      } = useShowPopups();

      const router = useRouter();

      readReports();

      async function createReportHandler() {
        await router.push({
          params: {
            action: 'create',
          },
        });

        setShowPopup('createReportPopup', true);
      }

      return {
        reports,
        readReports,

        showPopups,
        setShowPopup,

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
