<template>
  <div class="reports-screen">
    <div class="reports-screen-content">
      <div class="main-row-12">
        <button
        @click="setShowPopup('createReportPopup', true)">
          Создать
        </button>
      </div>
    </div>

    <CreateReportPopup
    v-if="showPopups.createReportPopup"
    @close="setShowPopup('createReportPopup', false)"/>
  </div>
</template>

<script lang="ts">
  import CreateReportPopup from './Popups/CreateReportPopup.vue';

  import useReportService from '@/core/service/report';
  import useShowPopups from './useShowPopups';

  export default {
    name: 'ReportsScreen',
    components: {
      CreateReportPopup,
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

      readReports();

      return {
        reports,
        readReports,

        showPopups,
        setShowPopup,
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
