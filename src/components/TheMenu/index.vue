<template>
  <div class="app-menu flex--dir--horizontal flex--align--center flex--justify--between">
    <div class="flex--dir--horizontal flex--align--center">
      <el-radio-group
      v-model="activePage"
      size="large">
        <el-radio-button
        disabled
        value="home">
          <div class="app-menu-button">
            <el-icon size="20">
              <GSymbol
              :grade="-25"
              icon="home"
              type="rounded"
              :weight="200"/>
            </el-icon>

            <p class="app-menu-button__text">
              Главная
            </p>
          </div>
        </el-radio-button>

        <el-radio-button value="reports">
          <div class="app-menu-button">
            <el-icon size="20">
              <GSymbol
              :grade="-25"
              icon="business_center"
              type="rounded"
              :weight="200"/>
            </el-icon>

            <p class="app-menu-button__text">
              Отчеты
            </p>
          </div>
        </el-radio-button>

        <el-radio-button
        disabled
        value="non-working-days">
          <div class="app-menu-button">
            <el-icon size="20">
              <GSymbol
              :grade="-25"
              icon="cloud"
              type="rounded"
              :weight="200"/>
            </el-icon>

            <p class="app-menu-button__text">
              Нерабочие дни
            </p>
          </div>
        </el-radio-button>

        <el-radio-button
        disabled
        value="employees">
          <div class="app-menu-button">
            <el-icon size="20">
              <GSymbol
              :grade="-25"
              icon="badge"
              type="rounded"
              :weight="200"/>
            </el-icon>

            <p class="app-menu-button__text">
              Подчиненные
            </p>
          </div>
        </el-radio-button>
      </el-radio-group>
    </div>

    <el-button
    @click="logoutHandler"
    round>
      <template #icon>
        <el-icon size="20">
          <GSymbol
          :grade="-25"
          icon="logout"
          type="rounded"
          :weight="200"/>
        </el-icon>
      </template>

      Выйти
    </el-button>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    watch,
  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { GSymbol } from 'vue-material-symbols';

  import useAuthStore from '@/store/auth';

  export default defineComponent({
    name: 'TheMenu',
    components: {
      GSymbol,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const authStore = useAuthStore();

      const activePage = ref<string>(route.name?.toString() ?? '');

      watch(activePage, () => {
        if (activePage.value) {
          router.push({
            name: activePage.value,
          });
        }
      });

      async function logoutHandler() {
        authStore.$reset();

        await router.push({
          name: 'auth',
          query: {
            actions: 'sign_in',
          },
        });
      }

      return {
        activePage,

        logoutHandler,
      };
    },
  });
</script>

<style lang="scss">
  .app-menu {
    padding: 16px;

    border-bottom: 1px solid rgba(0 0 0 / 0.14);
  }

  .app-menu-button {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 12px;
  }

  .app-menu-button__text {
    margin: 0;

    font-size: 16px;
  }
</style>
