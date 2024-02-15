<template>
  <div class="reports-card-form">
    <div class="reports-card-form-row">
      <div class="reports-card-form-label">
        <p>Время начала</p>

        <el-input
        v-model="form.startTime"
        :formatter="timeStringFormatter"
        placeholder="__:__"
        size="large"/>
      </div>

      <div class="reports-card-form-label">
        <p>Время окончания</p>

        <el-input
        v-model="form.endTime"
        :formatter="timeStringFormatter"
        placeholder="__:__"
        size="large"/>
      </div>

      <div class="reports-card-form-label">
        <p>Перерыв</p>

        <el-input
        v-model="form.breakTime"
        :formatter="timeStringFormatter"
        placeholder="__:__"
        size="large"/>
      </div>

      <div class="reports-card-form-label">
        <p>Время работы</p>

        <el-input
        v-model="form.workTime"
        disabled
        :formatter="timeStringFormatter"
        placeholder="__:__"
        readonly
        size="large"/>
      </div>
    </div>

    <wysiwig-editor v-model="form.body"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, PropType, reactive, toRefs, watch } from 'vue';
  import { debounce } from 'lodash';

  import { Report } from '@/store/reports.ts';

  import { getDateFromTimeString, timeStringFormatter } from '@/utils/time.ts';
  import dayjs from 'dayjs';
  import WysiwigEditor from '@/components/WysiwigEditor.vue';

  export default defineComponent({
    name: 'ReportsCardForm',
    props: {
      report: {
        type: Object as PropType<Report | null>,
        default: null,
      },
    },
    emits: ['update'],
    components: { WysiwigEditor },
    setup(props, context) {
      const propsRefs = toRefs(props);

      const form = reactive({
        startTime: '00:00',
        endTime: '00:00',
        breakTime: '00:00',
        workTime: '00:00',
        body: '',
      });

      const debouncedSave = debounce(() => {
        context.emit('update', {
          ...props.report,
          start_time: getDateFromTimeString(form.startTime).unix(),
          end_time: getDateFromTimeString(form.endTime).unix(),
          break_time: getDateFromTimeString(form.breakTime).unix(),
          work_time: getDateFromTimeString(form.workTime).unix(),
          body: form.body,
        });
      }, 500);

      function updateFormData() {
        const { report } = props;

        if (report) {
          form.startTime = dayjs(report.start_time * 1000).utc().format('HH:mm');
          form.endTime = dayjs(report.end_time * 1000).utc().format('HH:mm');
          form.breakTime = dayjs(report.break_time * 1000).utc().format('HH:mm');
          form.workTime = dayjs(report.work_time * 1000).utc().format('HH:mm');
          form.body = report.body;
        }
      }

      onBeforeMount(() => {
        updateFormData();
      });

      watch(propsRefs.report, () => {
        updateFormData();
      });

      watch(form, () => {
        const computedWorkTime = getDateFromTimeString(form.endTime).unix()
          - getDateFromTimeString(form.startTime).unix()
          - getDateFromTimeString(form.breakTime).unix();

        form.workTime = computedWorkTime <= 0
          ? '00:00'
          : dayjs(computedWorkTime * 1000).utc().format('HH:mm');

        debouncedSave();
      });

      return {
        form,

        timeStringFormatter,
      };
    },
  });
</script>

<style lang="scss">
  @use '@/styles/variables' as *;

  .reports-card-form {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    gap: 16px;
  }

  .reports-card-form-row {
    display: flex;
    flex-flow: row nowrap;
    gap: 12px;
  }

  .reports-card-form-label {
    display: flex;
    flex: 1 1 0;
    flex-flow: column nowrap;
    gap: 6px;

    p {
      margin-left: 2px;

      font-size: 14px;
      font-weight: 700;
      color: $text-color-secondary;
    }
  }
</style>
