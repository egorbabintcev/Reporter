<template>
  <div class="reports-editor-toolbar">
    <p class="reports-editor-toolbar__title">
      {{ titleText }}
    </p>

    <div class="flex--dir--horizontal flex--gap--12">
      <el-button
      @click="saveHandler"
      size="large">
        <template #icon>
          <el-icon
          size="24">
            <GSymbol
            fill
            :grade="-25"
            icon="save"
            type="outlined"/>
          </el-icon>
        </template>
      </el-button>

      <el-button
      @click="copyHandler"
      size="large">
        <template #icon>
          <el-icon
          size="24">
            <GSymbol
            fill
            :grade="-25"
            icon="content_copy"
            type="outlined"/>
          </el-icon>
        </template>
      </el-button>

      <el-button
      @click="deleteHandler"
      plain
      size="large"
      type="danger">
        <template #icon>
          <el-icon
          size="24">
            <GSymbol
            fill
            :grade="-25"
            icon="delete"
            type="outlined"/>
          </el-icon>
        </template>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    reactive,
    watch, computed,
  } from 'vue';
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import { ElMessageBox } from 'element-plus';
  import { GSymbol } from 'vue-material-symbols';

  import useReportsStore from '@/store/reports';

  export default defineComponent({
    name: 'ReportsEditorToolbar',
    components: {
      GSymbol,
    },
    emits: ['save', 'mail', 'copy', 'delete'],
    setup(props, context) {
      const dayReportsStore = useReportsStore('day-reports');
      const dayReportsStoreRefs = storeToRefs(dayReportsStore);

      const titleText = computed(() => {
        if (!dayReportsStoreRefs.report.value) return '';

        const formattedDate = dayjs(dayReportsStoreRefs.report.value.date * 1000).format('DD.MM.YYYY');

        return `Отчет о работе за день ${formattedDate}`;
      });

      function saveHandler() {
        context.emit('save');
      }

      function copyHandler() {
        context.emit('copy');
      }

      async function deleteHandler() {
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
      }

      return {
        titleText,

        saveHandler,
        copyHandler,
        deleteHandler,
      };
    },
  });
</script>

<style lang="scss">
  .reports-editor-toolbar {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 24px;

    padding: 12px 16px;

    border-bottom: 1px solid rgba(0 0 0 / 14%);
  }

  .reports-editor-toolbar__title {
    color: rgba(0 0 0 / 68%);
    font-size: 20px;
    font-weight: 600;
  }

  .reports-editor-toolbar-button__icon {
    font-size: 24px !important;

    display: inline-flex !important;
    align-items: center;
    justify-content: center;

    width: 28px;
    height: 28px;
  }
</style>
