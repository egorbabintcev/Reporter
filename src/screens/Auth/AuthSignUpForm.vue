<template>
  <form
  @submit.prevent="signUpHandler"
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
      Регистрация
    </p>

    <AuthFormInput
    v-model="form.displayName"
    @input="clearFormErrorsHandler"
    placeholder="Ваше имя"
    :error="formErrors.displayName"
    class="mb-3"/>

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
      rounded-full
      shadow-xl

      hover:bg-amber-400
      disabled:pointer-events-none
      disabled:opacity-50

      transition-all
    ">
      Создать
    </button>

    <div
    @click="goToSignInHandler"
    class="inline-flex items-center gap-1.5 cursor-pointer">
      <p
      class="
        text-base
        text-violet-500
        font-medium
      ">
        Уже есть аккаунт? Войти
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

  import { AuthSignUpPayload } from '@/core/domain/auth';
  import useAuthApi from '@/core/api/auth';

  import IconComponent from '@/components/Icon.vue';
  import AuthFormInput from './AuthFormInput.vue';

  export default defineComponent({
    name: 'AuthSignUpForm',
    components: {
      IconComponent,
      AuthFormInput,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();

      const authApi = useAuthApi();

      const form = reactive<Record<keyof AuthSignUpPayload, string>>({
        displayName: '',
        username: '',
        password: '',
      });

      const formErrors = reactive<Record<keyof AuthSignUpPayload, string | null>>({
        displayName: null,
        username: null,
        password: null,
      });

      const isFormEmpty = computed<boolean>(() => !Object.values(form).some(Boolean));
      const isFormHasErrors = computed<boolean>(() => Object.values(formErrors).some(Boolean));

      function clearFormErrorsHandler() {
        formErrors.displayName = null;
        formErrors.username = null;
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
          await authApi.signUp({
            displayName: form.displayName,
            username: form.username,
            password: form.password,
          });

          await goToSignInHandler();
        } catch (error) {
          if (error?.response?.status === 400) {
            formErrors.displayName = ' ';
            formErrors.username = ' ';
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
