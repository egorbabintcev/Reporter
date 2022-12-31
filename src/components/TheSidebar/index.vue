<template>
  <div class="sidebar">
    <a-menu
    v-model:selected-keys="selectedKeys"
    mode="inline">
      <a-menu-item
      active
      key="1">
        <template #icon>
          <home-filled/>
        </template>
        Главная
      </a-menu-item>

      <a-menu-item
      disabled
      key="2">
        <template #icon>
          <setting-filled/>
        </template>
        Настройки
      </a-menu-item>

      <a-menu-item
      disabled
      key="3">
        <template #icon>
          <project-filled/>
        </template>
        Статистика
      </a-menu-item>
    </a-menu>

    <a-button
    @click="logoutHandler"
    size="large"
    type="text">
      <template #icon>
        <logout-outlined/>
      </template>

      Logout
    </a-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import {
    HomeFilled, SettingFilled, ProjectFilled, LogoutOutlined,
  } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import useAuthStore from '@/core/store/auth';

  export default defineComponent({
    name: 'TheSidebar',
    components: {
      HomeFilled,
      SettingFilled,
      ProjectFilled,
      LogoutOutlined,
    },
    setup() {
      const selectedKeys = ref<string[]>(['1']);

      const router = useRouter();
      const authStore = useAuthStore();

      async function logoutHandler() {
        authStore.setAuthToken(null);

        await router.push({
          name: 'auth',
          query: {
            actions: 'sign_in',
          },
        });
      }

      return {
        selectedKeys,
        logoutHandler,
      };
    },
  });
</script>

<style lang="scss">
  .sidebar {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    width: 240px;
    min-width: 240px;
    padding-bottom: 16px;

    border-right: 1px solid rgba(0 0 0 / 14%);
  }
</style>
