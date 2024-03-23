<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    name: 'EmailPopup',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:show', 'confirm'],
    setup(_, context) {
      const form = reactive<{
        email: string
        password: string
        recipients: string
      }>({
        email: localStorage.getItem('Reporter_Email') ?? '',
        password: localStorage.getItem('Reporter_Password') ?? '',
        recipients: localStorage.getItem('Reporter_Recipients') ?? 'webreports@trueconf.ru',
      });

      function cancelClickHandler() {
        context.emit('update:show', false);
      }

      function confirmClickHandler() {
        context.emit('confirm', form);
      }

      return {
        form,

        cancelClickHandler,
        confirmClickHandler,
      };
    },
  });
</script>

<template>
  <el-dialog
  @update:model-value="$emit('update:show', $event)"
  alignCenter
  :modelValue="show"
  title="Отправить отчет по почте"
  :width="520">
    <div class="email-popup-content">
      <el-input
      v-model="form.email"
      placeholder="Почтовый адрес"
      size="large"/>

      <el-input
      v-model="form.password"
      placeholder="Пароль"
      showPassword
      size="large"/>

      <el-input
      v-model="form.recipients"
      placeholder="Получатели (через запятую)"
      size="large"/>
    </div>

    <template #footer>
      <div class="email-popup-footer">
        <el-button
        @click="cancelClickHandler">
          Отмена
        </el-button>

        <el-button
        @click="confirmClickHandler"
        type="primary">
          Сохранить и отправить
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
  .email-popup-content {
    display: flex;
    flex-flow: column nowrap;
    gap: 16px;
  }

  .email-popup-footer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    gap: 12px;
  }
</style>
