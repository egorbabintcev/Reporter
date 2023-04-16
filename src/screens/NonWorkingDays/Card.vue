<template>
  <div class="card">
    <div class="card-topline">
      <el-icon
      :color="iconColor"
      size="46">
        <g-symbol
        grade="-25.0"
        :icon="icon"
        weight="200.0"/>
      </el-icon>

      <div class="card__content">
        <template v-if="!editMode">
          <p class="card__title">
            {{ titleText }}
          </p>

          <p class="card__subtitle">
            {{ descriptionText }}
          </p>
        </template>

        <template v-else>
          <el-select v-model="form.type">
            <el-option
            v-for="(option) in optionList"
            :label="option.label"
            :value="option.value"
            :key="option.value"/>
          </el-select>

          <el-date-picker
          v-model="form.date"
          class="card__date-picker"
          :editable="false"
          format="DD.MM.YYYY"
          type="daterange"
          ref="editModeDatePicker"/>
        </template>
      </div>
    </div>

    <div class="card-bottomline">
      <div class="card__spacer"/>

      <div class="card-buttons">
        <template v-if="!editMode">
          <el-button
          @click="editMode = true"
          :icon="Edit"
          plain/>

          <el-button
          @click="handleDelete"
          :icon="Delete"
          plain
          type="danger"/>
        </template>

        <template v-else>
          <el-button
          @click="handleCancel"
          :icon="Close"
          plain
          type="danger"/>

          <el-button
          @click="handleSave"
          :icon="Check"
          :loading="saveLoading"
          plain
          type="success"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent, reactive, ref, toRefs, watch, computed, PropType,
  } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { ElMessageBox } from 'element-plus';
  import {
    Edit, Delete, Close, Check,
  } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  import { GSymbol } from 'vue-material-symbols';

  type TForm = {
    type: 'vacation_paid' | 'vacation_unpaid' | 'sick_leave' | 'day_off'
    date: [Date, Date],
  }

  export default defineComponent({
    name: 'CardComponent',
    components: { GSymbol },
    props: {
      data: {
        type: Object as PropType<{
          type: 'vacation_paid' | 'vacation_unpaid' | 'sick_leave' | 'day_off'
          dateFrom: Dayjs
          dateTo: Dayjs
        }>,
        default: () => ({
          type: 'vacation_paid',
          dateFrom: dayjs(),
          dateTo: dayjs(),
        }),
      },
      initialMode: {
        type: String as PropType<'normal' | 'edit'>,
        default: () => 'normal',
      },
    },
    emits: ['save', 'cancel', 'delete'],
    setup(props, context) {
      const optionList = [
        {
          label: 'Отпуск (оплачиваемый)',
          value: 'vacation_paid',
        },
        {
          label: 'Отпуск (за свой счет)',
          value: 'vacation_unpaid',
        },
        {
          label: 'Больничный',
          value: 'sick_leave',
        },
        {
          label: 'Day-off',
          value: 'day_off',
        },
      ];

      const propsRefs = toRefs(props);

      const saveLoading = ref(false);

      const form = reactive<TForm>({
        type: props.data.type,
        date: [props.data.dateFrom.toDate(), props.data.dateTo.toDate()],
      });

      function resetForm() {
        form.type = propsRefs.data.value.type;
        form.date = [propsRefs.data.value.dateFrom.toDate(), propsRefs.data.value.dateTo.toDate()];
      }

      watch(propsRefs.data, () => {
        resetForm();
      });

      const titleText = computed(() => {
        const option = optionList.find((option) => option.value === form.type);

        if (!option) return '';

        return option.label;
      });

      const icon = computed(() => {
        return {
          vacation_paid: 'beach_access',
          vacation_unpaid: 'beach_access',
          sick_leave: 'sick',
          day_off: 'event',
        }[form.type];
      });

      const iconColor = computed(() => {
        return {
          vacation_paid: '#66bb6a',
          vacation_unpaid: '#66bb6a',
          sick_leave: '#EF5350',
          day_off: '#ffa726',
        }[form.type];
      });

      const editMode = ref<boolean>(props.initialMode === 'edit');

      async function handleCancel() {
        await ElMessageBox.confirm(
          'Вы точно хотите отменить внесенные изменения?',
          'Отмена изменений',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Отмена',
            type: 'warning',
          },
        );

        context.emit('cancel');

        editMode.value = false;
        resetForm();
      }

      async function handleSave() {
        context.emit('save');

        editMode.value = false;
      }

      async function handleDelete() {
        await ElMessageBox.confirm(
          'Вы точно хотите выполнить удаление? Отменить это действие будет невозможно',
          'Удалить',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Отмена',
            type: 'warning',
          },
        );

        context.emit('delete');

        editMode.value = false;
        resetForm();
      }

      const descriptionText = computed(() => {
        return `${propsRefs.data.value?.dateFrom.format('DD.MM.YYYY')} - ${propsRefs.data.value?.dateTo.format('DD.MM.YYYY')}`;
      });

      return {
        form,

        optionList,
        titleText,
        descriptionText,
        icon,
        iconColor,

        editMode,
        saveLoading,

        handleSave,
        handleCancel,
        handleDelete,

        // icon components
        Edit,
        Delete,
        Close,
        Check,
      };
    },
  });
</script>

<style lang="scss">
  .card {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    width: 330px;
    height: 160px;
    padding: 16px;

    background-color: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0 0 0 / 14%);
  }

  .card__spacer {
    flex-grow: 1;
  }

  .card-topline {
    display: flex;
    flex-flow: row nowrap;
    gap: 12px;
  }

  .card__icon {
    width: 64px;
    min-width: 64px;
    height: 64px;

    background-color: #bbdefb;
    border-radius: 4px;
  }

  .card__content {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    gap: 6px;
  }

  .card__title {
    color: rgba(0 0 0 / 87%);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.1;
  }

  .card__subtitle {
    color: rgba(0 0 0 / 54%);
    font-size: 14px;
    line-height: 1.1;
  }

  .card__date-picker {
    --el-text-color-regular: rgba(0 0 0 / 54%);
    --el-date-editor-daterange-width: unset;
  }

  .card-bottomline {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    padding-top: 12px;

    border-top: 1px solid rgba(0 0 0 / 8%);
  }

  .card-status {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 6px;
  }

  .card-status__icon {
    width: 8px;
    height: 8px;

    background-color: #66bb6a;
    border-radius: 50%;
  }

  .card-status__text {
    color: rgba(0 0 0 / 54%);
    font-size: 14px;
  }

  .card-buttons {
    display: flex;
    flex-flow: row nowrap;
  }
</style>
