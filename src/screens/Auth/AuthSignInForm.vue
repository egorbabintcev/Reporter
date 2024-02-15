<template>
  <div class="auth-form">
    <form
    @submit.prevent="signInHandler"
    class="auth-form__inputs">
      <div class="section-16">
        <div class="section-12">
          <AuthFormInput
          v-model="form.login"
          :error="formErrors.login"
          placeholder="Логин"
          size="large"/>

          <AuthFormInput
          v-model="form.password"
          :error="formErrors.password"
          placeholder="Пароль"
          size="large"
          type="password"/>
        </div>

        <el-button
        @click="signInHandler"
        htmlType="submit"
        size="large"
        type="primary">
          Войти
        </el-button>
      </div>
    </form>

    <div class="auth-form__separator"/>

    <div class="auth-form__hint">
      <p class="auth-form__hint-text">
        Нет учетной записи? <span
        @click="goToSignUpHandler"
        class="auth-form__hint-text--link">Зарегистрироваться</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { AxiosError } from 'axios';

  import useAuthStore, { AuthSignInPayload } from '@/store/auth';

  import AuthFormInput from './AuthFormInput.vue';

  export default defineComponent({
    name: 'AuthSignInForm',
    components: {
      AuthFormInput,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();

      const authStore = useAuthStore();

      const form = reactive<Record<keyof AuthSignInPayload, string>>({
        login: '',
        password: '',
      });

      const formErrors = reactive<Record<keyof AuthSignInPayload, string | null>>({
        login: null,
        password: null,
      });

      const isFormEmpty = computed<boolean>(() => !Object.values(form).some(Boolean));
      const isFormHasErrors = computed<boolean>(() => Object.values(formErrors).some(Boolean));

      function clearFormErrorsHandler() {
        formErrors.login = null;
        formErrors.password = null;
      }

      async function signInHandler() {
        try {
          await authStore.signIn({
            login: form.login,
            password: form.password,
          });

          await router.push(String(route.query.redirect) || '/');
        } catch (error) {
          if (error instanceof AxiosError && error?.response?.status === 401) {
            formErrors.login = ' ';
            formErrors.password = 'Неверный логин или пароль';
          }
        }
      }

      function goToSignUpHandler() {
        router.push({
          query: {
            ...route.query,
            action: 'sign_up',
          },
        });
      }

      return {
        form,
        formErrors,
        isFormEmpty,
        isFormHasErrors,
        clearFormErrorsHandler,

        signInHandler,
        goToSignUpHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
