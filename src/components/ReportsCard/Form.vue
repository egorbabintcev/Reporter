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
        disabled
        :formatter="timeStringFormatter"
        :modelValue="form.workTime"
        placeholder="__:__"
        readonly
        size="large"/>
      </div>
    </div>

    <wysiwig-editor v-model="form.body"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, reactive, toRefs, watch } from 'vue';
  import { debounce } from 'lodash';
  import dayjs from 'dayjs';

  import WysiwigEditor from '@/components/WysiwigEditor.vue';

  import { getDateFromTimeString, timeStringFormatter } from '@/utils/time.ts';

  export default defineComponent({
    name: 'ReportsCardForm',
    props: {
      startTime: {
        type: String,
        default: '',
      },
      endTime: {
        type: String,
        default: '',
      },
      breakTime: {
        type: String,
        default: '',
      },
      workTime: {
        type: String,
        default: '',
      },
      body: {
        type: String,
        default: '',
      },
    },
    emits: ['update:startTime', 'update:endTime', 'update:breakTime', 'update:workTime', 'update:body'],
    components: {
      WysiwigEditor,
    },
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
        context.emit('update:startTime', form.startTime);
        context.emit('update:endTime', form.endTime);
        context.emit('update:breakTime', form.breakTime);
        context.emit('update:workTime', form.workTime);
        context.emit('update:body', form.body);
      }, 500);

      function updateFormData() {
        form.startTime = props.startTime;
        form.endTime = props.endTime;
        form.breakTime = props.breakTime;
        form.workTime = props.workTime;
        form.body = props.body;
      }

      onBeforeMount(() => {
        updateFormData();
      });

      watch([...Object.values(propsRefs)], () => {
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
