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
          plain
          type="primary">
            <template #icon>
              <el-icon>
                <g-symbol
                :grade="-25"
                icon="add_circle_outline"
                weight="400.0"/>
              </el-icon>
            </template>

            Добавить
          </el-button>
        </div>

        <Card
        v-if="createMode"
        @cancel="createMode = false"
        @save="createHandler"
        initial-mode="edit"/>

        <Card
        v-for="(event, index) in mappedEventList"
        @delete="deleteHandler(event)"
        :data="event"
        :key="index"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    computed, defineComponent, reactive, ref, watch,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import dayjs, { Dayjs } from 'dayjs';

  import { ElMessage } from 'element-plus';

  import Card from './Card.vue';

  import { TCalendarEvent } from '@/core/domain/calendar';

  import useVacationPaidApi from '@/core/api/vacation-paid';
  import useVacationUnpaidApi from '@/core/api/vacation-unpaid';
  import useSickLeaveApi from '@/core/api/sick-leave';
  import useDayOffApi from '@/core/api/day-off';
  import useCalendarApi from '@/core/api/calendar';

  import useCalendarStore from '@/core/store/calendar';
  import { GSymbol } from 'vue-material-symbols';

  export default defineComponent({
    name: 'NonWorkingDaysScreen',
    components: {
      GSymbol,
      Card,
    },
    setup() {
      const vacationPaidApi = useVacationPaidApi();
      const vacationUnpaidApi = useVacationUnpaidApi();
      const sickLeaveApi = useSickLeaveApi();
      const dayOffApi = useDayOffApi();
      const calendarApi = useCalendarApi();

      const calendarStore = useCalendarStore();
      const calendarStoreRefs = storeToRefs(calendarStore);

      const createMode = ref(false);

      const form = reactive({
        type: ['vacations_paid', 'vacations_unpaid', 'sick_leave', 'day_off'],
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
          label: 'Отпуск (оплачиваемый)',
          value: 'vacations_paid',
        },
        {
          label: 'Отпуск (за свой счет)',
          value: 'vacations_unpaid',
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
          id: event.id,
          type: event.type,
          dateFrom: dayjs(event.dateFrom),
          dateTo: dayjs(event.dateTo),
        }));
      });

      async function createHandler(data: {
        type: 'vacations_paid' | 'vacations_unpaid' | 'sick_leave' | 'day_off'
        dateFrom: Dayjs
        dateTo: Dayjs
      }) {
        switch (data.type) {
        case 'vacations_paid':
          await vacationPaidApi.createVacationPaid({
            dateFrom: data.dateFrom.unix() * 1000,
            dateTo: data.dateTo.unix() * 1000,
            description: '',
          });
          break;
        case 'vacations_unpaid':
          await vacationUnpaidApi.createVacationUnpaid({
            dateFrom: data.dateFrom.unix() * 1000,
            dateTo: data.dateTo.unix() * 1000,
            description: '',
          });
          break;
        default:
          break;
        }

        createMode.value = false;
        await fetchCalendarEventList();
      }

      async function deleteHandler(event: TCalendarEvent) {
        console.log(event.id);

        switch (event.type) {
        case 'vacations_paid':
          await vacationPaidApi.deleteVacationPaid(event.id);
          break;
        case 'vacations_unpaid':
          await vacationUnpaidApi.deleteVacationUnpaid(event.id);
          break;
        case 'day_off':
          await dayOffApi.deleteDayOff(event.id);
          break;
        case 'sick_leave':
          await sickLeaveApi.deleteSickLeave(event.id);
          break;
        default:
          break;
        }

        await fetchCalendarEventList();
      }

      return {
        createMode,
        formType,
        formMonth,
        optionList,

        filteredEventList,
        mappedEventList,

        createHandler,
        deleteHandler,

        dayjs,
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
