<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import useAuthStore from '@/store/auth.ts';

  export default defineComponent({
    name: 'AuthFormSignIn',
    emits: ['switchToSignUp'],
    setup(_, context) {
      const route = useRoute();
      const router = useRouter();

      const authStore = useAuthStore();

      const form = reactive<{
        login: string
        password: string
      }>({
        login: '',
        password: '',
      });

      const formErrors = reactive<{
        login: string | undefined
        password: string | undefined
      }>({
        login: undefined,
        password: undefined,
      });

      async function signInClickHandler() {
        if (!form.login) {
          formErrors.login = 'Это поле должно быть заполнено';
        }

        if (!form.password) {
          formErrors.password = 'Это поле должно быть заполнено';
        }

        if (Object.values(formErrors).some(Boolean)) return;

        try {
          await authStore.signIn({
            login: form.login,
            password: form.password,
          });

          await router.push(String(route.query.redirect) || '/');
        } catch {
          formErrors.login = ' ';
          formErrors.password = 'Неверный логин или пароль';
        }
      }

      function switchToSignUpClickHandler() {
        context.emit('switchToSignUp');
      }

      return {
        form,
        formErrors,

        signInClickHandler,
        switchToSignUpClickHandler,
      };
    },
  });
</script>

<template>
  <div class="auth-form-sign-in">
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
      @update:model-value="formErrors.password = undefined"
      placeholder="Пароль"
      showPassword
      size="large"/>
    </el-form-item>

    <el-button
    @click="signInClickHandler"
    size="large"
    type="primary">
      Войти
    </el-button>

    <p class="auth-form-sign-in__hint">
      Еще не зарегистрированы? <span
      @click="switchToSignUpClickHandler"
      class="auth-form-sign-in__hint--clickable">Создать аккаунт</span>
    </p>
  </div>
</template>

<style lang="scss">
  .auth-form-sign-in {
    display: flex;
    flex-flow: column nowrap;
    gap: 12px;
  }

  .auth-form-sign-in__hint {
    color: rgba(0 0 0 / 0.54);
    text-align: center;

    user-select: none;
  }

  .auth-form-sign-in__hint--clickable {
    color: #409eff;

    cursor: pointer;
  }
</style>
