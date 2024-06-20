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

    <div class="app-menu-center">
      <p class="app-menu-badge">
        Переезд! С 01.07.24 сервис будет доступен по адресу: <a
        href="https://10.110.2.46"
        target="_blank">10.110.2.46</a> <br> Данные из этого сервиса к сожалению перенесены не будут(
      </p>
    </div>

    <div class="app-menu-right">
      <theme-switcher/>

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

  import ThemeSwitcher from '@/components/ThemeSwitcher';

  import useAuthStore from '@/store/auth';

  export default defineComponent({
    name: 'TheMenu',
    components: {
      ThemeSwitcher,
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
            action: 'sign_in',
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

    border-bottom: 1px solid var(--border-color-primary);
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

  .app-menu-right {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 24px;
  }

  .app-menu-badge {
    font-size: 16px;
    line-height: 1.4;
    color: var(--el-color-danger);
    text-align: center;

    a {
      font-weight: 700;
      color: inherit;
      text-decoration: underline;
    }
  }
</style>
