<template>
  <div
  class="
    flex
    flex-row
    border-b
    border-b-gray-200
    border-solid
  ">
    <div
    class="
      flex
      flex-row
      items-center
      px-3
      py-1.5
      overflow-hidden
      w-3/12
      min-w-0
    ">
      <p>
        {{ getDateStringFromDate(new Date(report.date)) }}
      </p>
    </div>

    <div
    class="
      flex
      flex-row
      items-center
      px-3
      py-1.5
      overflow-hidden
      w-2/12
      min-w-0
    ">
      <p>
        {{ getTimeStringFromDate(new Date(report.startTime)) }}
      </p>
    </div>

    <div
    class="
      flex
      flex-row
      items-center
      px-3
      py-1.5
      overflow-hidden
      w-2/12
      min-w-0
    ">
      <p>
        {{ getTimeStringFromDate(new Date(report.endTime)) }}
      </p>
    </div>

    <div
    class="
      flex
      flex-row
      items-center
      px-3
      py-1.5
      overflow-hidden
      w-2/12
      min-w-0
    ">
      <p>
        {{ getTimeStringFromDate(new Date(report.breakTime)) }}
      </p>
    </div>

    <div
    class="
      flex
      flex-row
      items-center
      px-3
      py-1.5
      overflow-hidden
      w-3/12
      min-w-fit
    ">
      <div class="flex flex-row items-center gap-3">
        <button
        @click="copyReportHandler"
        title="Скопировать HTML"
        class="
          w-10
          h-10
          p-1.5
          rounded
          border
          border-slate-200
          border-solid
          hover:bg-slate-200
          focus:active:border-slate-300
        ">
          <IconComponent
          icon="file_copy"
          class="text-slate-500"/>
        </button>

        <button
        @click="editReportHandler"
        title="Редактировать"
        class="
          w-10
          h-10
          p-1.5
          rounded
          border
          border-slate-200
          border-solid
          hover:bg-slate-200
          focus:active:border-slate-300
        ">
          <IconComponent
          icon="edit"
          class="text-slate-500"/>
        </button>

        <button
        @click="deleteReportHandler"
        title="Удалить"
        class="
          w-10
          h-10
          p-1.5
          rounded
          border
          border-red-200
          border-solid
          hover:bg-red-200
          focus:active:border-red-300
        ">
          <IconComponent
          icon="delete"
          class="text-red-500"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import MarkdownIt from 'markdown-it';

  import IconComponent from '@/components/Icon.vue';

  import { Report } from '@/core/domain/report';

  import { getTimeStringFromDate, getDateStringFromDate } from '@/core/utils/time';
  import useReportApi from '@/core/api/report';
  import useReportStore from '@/core/store/report';
  import useReportAdapter from '@/core/adapters/report';

  export default defineComponent({
    name: 'ReportsTableItem',
    components: {
      IconComponent,
    },
    props: {
      report: {
        type: Object as PropType<Report>,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const reportApi = useReportApi();
      const reportStore = useReportStore();
      const reportAdapters = useReportAdapter();

      const router = useRouter();

      const maxIndex = computed(() => reportStore.reports.length - 1);

      async function editReportHandler() {
        await router.push({
          query: {
            id: props.report.id,
            action: 'edit',
          },
        });
      }

      async function deleteReportHandler() {
        await reportApi.deleteReport(props.report.id);

        const reports = await reportApi.readReports();
        reportStore.setReports(reports);
      }

      async function copyReportHandler() {
        let template = 'Дата: {{date}}\nВремя: {{startTime}}-{{endTime}}\nПерерыв: {{breakTime}}\nРабочих часов: {{workTime}}\n\n{{body}}';

        const reportHTML = reportAdapters.convertReportToHTML(props.report);

        Object.entries(reportHTML).forEach(([key, value]) => {
          template = template.replaceAll(new RegExp(`{{${key}}}`, 'g'), value);
        });

        const html = MarkdownIt({ breaks: true }).render(template);

        // eslint-disable-next-line no-undef
        await window.navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([template], { type: 'text/plain' }),
        })]);

        return template;
      }

      return {
        maxIndex,
        getTimeStringFromDate,
        getDateStringFromDate,

        editReportHandler,
        deleteReportHandler,
        copyReportHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
