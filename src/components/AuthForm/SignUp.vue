<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import useAuthStore from '@/store/auth.ts';

  export default defineComponent({
    name: 'AuthFormSignUp',
    emits: ['switchToSignIn'],
    setup(_, context) {
      const route = useRoute();
      const router = useRouter();

      const authStore = useAuthStore();

      const form = reactive<{
        login: string
        password: string
        confirmPassword: string
      }>({
        login: '',
        password: '',
        confirmPassword: '',
      });

      const formErrors = reactive<{
        login: string | undefined
        password: string | undefined
        confirmPassword: string | undefined
      }>({
        login: undefined,
        password: undefined,
        confirmPassword: undefined,
      });

      function validateForm() {
        if (!form.login) {
          formErrors.login = 'Это поле должно быть заполнено';
        } else {
          if (form.login.length < 3) {
            formErrors.login = 'Минимальная длина - 3 символа';
          }

          if (form.login.length > 20) {
            formErrors.login = 'Максимальная длина - 20 символов';
          }
        }

        if (!form.password) {
          formErrors.password = 'Это поле должно быть заполнено';
        }

        if (!form.confirmPassword) {
          formErrors.confirmPassword = 'Это поле должно быть заполнено';
        }

        if (form.password && form.confirmPassword) {
          if (form.password !== form.confirmPassword) {
            formErrors.password = 'Пароли не совпадают';
            formErrors.confirmPassword = 'Пароли не совпадают';
          } else {
            if (form.password.length < 6) {
              formErrors.password = 'Минимальная длина - 6 символов';
            }

            if (form.password.length > 128) {
              formErrors.password = 'Максимальная длина - 128 символов';
            }
          }
        }
      }

      async function signUpClickHandler() {
        validateForm();

        if (Object.values(formErrors).some(Boolean)) return;

        try {
          await authStore.signUp({
            display_name: form.login,
            login: form.login,
            password: form.password,
          });

          await router.push(String(route.query.redirect) || '/');
        } catch {
          formErrors.login = 'Логин уже существует';
        }
      }

      function switchToSignInClickHandler() {
        context.emit('switchToSignIn');
      }

      return {
        form,
        formErrors,

        signUpClickHandler,
        switchToSignInClickHandler,
      };
    },
  });
</script>

<template>
  <div class="auth-form-sign-up">
    <el-form-item
    :error="formErrors.login">
      <el-input
      v-model="form.login"
      @update:model-value="formErrors.login = undefined"
      placeholder="Логин"
      size="large"/>
    </el-form-item>

    <el-form-item
    :error="formErrors.password">
      <el-input
      v-model="form.password"
      @update:model-value="() => {
        formErrors.password = undefined;
        formErrors.confirmPassword = undefined;
      }"
      placeholder="Пароль"
      showPassword
      size="large"/>
    </el-form-item>

    <el-form-item
    :error="formErrors.confirmPassword">
      <el-input
      v-model="form.confirmPassword"
      @update:model-value="() => {
        formErrors.password = undefined;
        formErrors.confirmPassword = undefined;
      }"
      placeholder="Подтвердите пароль"
      showPassword
      size="large"/>
    </el-form-item>

    <el-button
    @click="signUpClickHandler"
    size="large"
    type="primary">
      Зарегистрироваться
    </el-button>

    <p class="auth-form-sign-up__hint">
      Уже есть аккаунт? <span
      @click="switchToSignInClickHandler"
      class="auth-form-sign-up__hint--clickable">Войти</span>
    </p>
  </div>
</template>

<style lang="scss">
  .auth-form-sign-up {
    display: flex;
    flex-flow: column nowrap;
    gap: 12px;
  }

  .auth-form-sign-up__hint {
    color: var(--text-color-secondary);
    text-align: center;

    user-select: none;
  }

  .auth-form-sign-up__hint--clickable {
    color: var(--main-color-primary);

    cursor: pointer;
  }
</style>
