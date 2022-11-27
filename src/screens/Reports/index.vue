<template>
  <div class="flex flex-grow flex-col p-4">
    <div class="flex flex-grow flex-col p-6 overflow-hidden rounded-2xl shadow-xl bg-white">
      <div class="flex flex-col flex-grow gap-12 overflow-hidden">
        <div class="flex flex-col gap-2 max-w-screen-lg">
          <ReportsHeader/>

          <!--<ReportsStats/>-->
        </div>

        <div class="flex flex-col flex-grow gap-5 overflow-hidden">
          <div class="flex flex-row gap-4 max-w-screen-lg">
            <button
            @click="createReportHandler"
            class="
              px-4
              py-2
              rounded
              border
              hover:bg-gray-100
              focus:active:border-gray-400
            ">
              Создать
            </button>

            <InputComponent
            modelValue=""
            placeholder="Поиск"
            class="flex-grow"
            disabled/>
          </div>

          <ReportsTable/>
        </div>
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

  import ReportsHeader from '@/screens/Reports/ReportsHeader.vue';
  import ReportsTable from '@/screens/Reports/ReportsTable.vue';
  import ManageReportPopup from './Popups/ManageReportPopup/index.vue';
  import InputComponent from '@/components/Input.vue';

  export default {
    name: 'ReportsScreen',
    components: {
      ReportsHeader,
      ReportsTable,
      ManageReportPopup,
      InputComponent,
    },
    setup() {
      const reportApi = useReportApi();
      const reportStore = useReportStore();

      const router = useRouter();
      const route = useRoute();

      const showManagePopup = computed(() => ['create', 'edit'].includes(route.query.action as 'create' | 'edit'));
      const showPreviewPopup = computed(() => route.query.action === 'preview');

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
        showPreviewPopup,

        createReportHandler,
      };
    },
  };
</script>

<style lang="scss">

</style>
