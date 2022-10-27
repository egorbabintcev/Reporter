<template>
  <form
  @submit.prevent="signInHandler"
  class="
    flex
    flex-col
    items-center

    w-[335px]
    h-[500px]
    pt-14
    pb-8
    px-8

    bg-white
    rounded-2xl
    shadow-2xl
  ">
    <p
    class="
          mb-9
          text-4xl
          text-gray-900
        ">
      Вход
    </p>

    <AuthFormInput
    v-model="form.username"
    @input="clearFormErrorsHandler"
    placeholder="Логин"
    :error="formErrors.username"
    class="mb-3"/>

    <AuthFormInput
    v-model="form.password"
    @input="clearFormErrorsHandler"
    type="password"
    placeholder="Пароль"
    :error="formErrors.password"
    class="mb-5"/>

    <button
    :disabled="isFormEmpty || isFormHasErrors"
    type="submit"
    class="
          uppercase

          w-full
          py-2.5
          mb-auto

          outline-0
          bg-amber-500
          shadow-xl

          hover:bg-amber-400
          disabled:pointer-events-none
          disabled:opacity-50

          rounded-full

          transition-all
        ">
      Войти
    </button>

    <div
    @click="goToSignUpHandler"
    class="inline-flex items-center gap-1.5 cursor-pointer">
      <p
      class="
        text-base
        text-violet-500
        font-medium
      ">
        Создать аккаунт
      </p>

      <IconComponent
      icon="trending_flat"
      class="text-violet-500 font-light"/>
    </div>
  </form>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { AuthSignInPayload } from '@/core/domain/auth';
  import useAuthApi from '@/core/api/auth';
  import useAuthStore from '@/core/store/auth';

  import IconComponent from '@/components/Icon.vue';
  import AuthFormInput from './AuthFormInput.vue';

  export default defineComponent({
    name: 'AuthSignInForm',
    components: {
      IconComponent,
      AuthFormInput,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();

      const authApi = useAuthApi();
      const authStore = useAuthStore();

      const form = reactive<Record<keyof AuthSignInPayload, string>>({
        username: '',
        password: '',
      });

      const formErrors = reactive<Record<keyof AuthSignInPayload, string | null>>({
        username: null,
        password: null,
      });

      const isFormEmpty = computed<boolean>(() => !Object.values(form).some(Boolean));
      const isFormHasErrors = computed<boolean>(() => Object.values(formErrors).some(Boolean));

      function clearFormErrorsHandler() {
        formErrors.username = null;
        formErrors.password = null;
      }

      async function signInHandler() {
        try {
          const token = await authApi.signIn({
            username: form.username,
            password: form.password,
          });

          authStore.setAuthToken(token);

          await router.push(String(route.query.redirect) || '/');
        } catch (error) {
          if (error?.response?.status === 401) {
            formErrors.username = ' ';
            formErrors.password = 'Введены неверные данные';
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
