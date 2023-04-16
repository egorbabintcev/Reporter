<template>
  <div class="non-working-days-screen">
    <div class="section-24 flex--grow">
      <div class="row-12">
        <el-date-picker
        v-model="formMonth"
        class="non-working-days-filters__month-picker"
        :clearable="false"
        format="MMMM YYYY"
        size="large"
        type="month"/>

        <el-select
        v-model="formType"
        class="non-working-days-filters__type-selector"
        collapse-tags
        multiple
        size="large">
          <el-option
          v-for="(option) in optionList"
          :label="option.label"
          :value="option.value"
          :key="option.value"/>
        </el-select>
      </div>

      <div class="row-24">
        <div
        v-if="!createMode"
        class="non-working-days-create-card">
          <el-button
          @click="createMode = true"
          :icon="CirclePlus"
          plain
          type="primary">
            Добавить
          </el-button>
        </div>

        <Card
        v-if="createMode"
        @cancel="createMode = false"
        @save="createMode = false"
        initial-mode="edit"/>

        <Card
        :date-from="dayjs()"
        :date-to="dayjs()"
        :on-delete="deleteHandler"
        type="day_off"/>

        <Card
        :date-from="dayjs()"
        :date-to="dayjs()"
        type="vacation_paid"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    computed, defineComponent, onMounted, reactive, readonly, ref, watch,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import dayjs from 'dayjs';

  import { ElMessage } from 'element-plus';
  import { CirclePlus } from '@element-plus/icons-vue';

  import Card from './Card.vue';

  import useSickLeaveApi from '@/core/api/sick-leave';
  import useVacationApi from '@/core/api/vacation';
  import useCalendarApi from '@/core/api/calendar';

  import useCalendarStore from '@/core/store/calendar';

  export default defineComponent({
    name: 'NonWorkingDaysScreen',
    components: {
      Card,
    },
    setup() {
      const calendarApi = useCalendarApi();

      const calendarStore = useCalendarStore();
      const calendarStoreRefs = storeToRefs(calendarStore);

      const createMode = ref(false);

      const form = reactive({
        type: ['vacation', 'sick_leave', 'day_off'],
        month: dayjs(),
      });

      const formType = computed({
        get() {
          return form.type;
        },
        set(value: typeof form.type) {
          form.type = value;
        },
      });

      const formMonth = computed({
        get() {
          return form.month.toISOString();
        },
        set(value: string) {
          form.month = dayjs(value);
        },
      });

      const optionList = [
        {
          label: 'Отпуск',
          value: 'vacation',
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

      async function fetchCalendarEventList() {
        const eventList = await calendarApi.getCalendarEventList({
          date_from: form.month.startOf('month').unix(),
          date_to: form.month.endOf('month').unix(),
        });

        calendarStore.setEventList(eventList);
      }

      watch(
        form,
        () => {
          fetchCalendarEventList();
        },
        { immediate: true },
      );

      const filteredEventList = computed(() => {
        return calendarStoreRefs.eventList.value.filter((event) => {
          return form.type.includes(event.type);
        });
      });

      const mappedEventList = computed(() => {
        return filteredEventList.value.map((event) => ({
          type: event.type,
          dateFrom: dayjs(event.dateFrom),
          dateTo: dayjs(event.dateTo),
        }));
      });

      function deleteHandler() {
        return new Promise((res) => {
          setTimeout(() => {
            res(null);

            ElMessage({
              message: 'Successfuly deleted',
            });
          }, 3000);
        });
      }

      return {
        createMode,
        formType,
        formMonth,
        optionList,

        filteredEventList,
        mappedEventList,

        deleteHandler,

        dayjs,

        CirclePlus,
      };
    },
  });
</script>

<style lang="scss">
  .non-working-days-screen {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    padding: 16px;
  }

  .non-working-days-create-popup__picker {
    width: 100%;
  }

  .non-working-days-title {
    color: rgba(0 0 0 / 75%);
    font-size: 28px;
    font-weight: 500;

    margin: 0;
  }

  .non-working-days-filters__type-selector {
    width: 320px;
  }

  .non-working-days-create-card {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    gap: 12px;

    width: 330px;
    height: 160px;
    padding: 16px;

    background-color: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0 0 0 / 14%);
  }
</style>
