<template>
  <div class="auth-form">
    <form
    @submit.prevent
    class="auth-form__inputs">
      <div class="section-16">
        <div class="section-12">
          <AuthFormInput
          v-model="form.display_name"
          :error="formErrors.display_name"
          placeholder="Ваше имя"
          size="large"/>

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
        @click="signUpHandler"
        htmlType="submit"
        size="large"
        type="primary">
          Зарегистрироваться
        </el-button>
      </div>
    </form>

    <div class="auth-form__separator"/>

    <div class="auth-form__hint">
      <p class="auth-form__hint-text">
        Уже есть учетная запись? <span
        @click="goToSignInHandler"
        class="auth-form__hint-text--link">Войти</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { AxiosError } from 'axios';

  import useAuthStore, { AuthSignUpPayload } from '@/store/auth';

  import AuthFormInput from './AuthFormInput.vue';

  export default defineComponent({
    name: 'AuthSignUpForm',
    components: {
      AuthFormInput,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();

      const authStore = useAuthStore();

      const form = reactive<Record<keyof AuthSignUpPayload, string>>({
        display_name: '',
        login: '',
        password: '',
      });

      const formErrors = reactive<Record<keyof AuthSignUpPayload, string | null>>({
        display_name: null,
        login: null,
        password: null,
      });

      const isFormEmpty = computed<boolean>(() => !Object.values(form).some(Boolean));
      const isFormHasErrors = computed<boolean>(() => Object.values(formErrors).some(Boolean));

      function clearFormErrorsHandler() {
        formErrors.display_name = null;
        formErrors.login = null;
        formErrors.password = null;
      }

      async function goToSignInHandler() {
        await router.push({
          query: {
            ...route.query,
            action: 'sign_in',
          },
        });
      }

      async function signUpHandler() {
        try {
          await authStore.signUp({
            display_name: form.display_name,
            login: form.login,
            password: form.password,
          });

          await goToSignInHandler();
        } catch (error) {
          if (error instanceof AxiosError && error?.response?.status === 400) {
            formErrors.display_name = ' ';
            formErrors.login = ' ';
            formErrors.password = 'Введеные неверные данные';
          }
        }
      }

      return {
        form,
        formErrors,
        isFormEmpty,
        isFormHasErrors,
        clearFormErrorsHandler,

        signUpHandler,
        goToSignInHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
