<template>
  <div class="flex flex-grow flex-col p-5">
    <div class="flex flex-grow flex-col justify-center items-center">
      <div
      @keydown.enter="signInHandler"
      class="flex flex-col gap-4 w-96">
        <InputComponent
        v-model="form.username"
        placeholder="Введите логин"/>

        <InputComponent
        v-model="form.password"
        type="password"
        placeholder="Введите пароль"/>

        <button
        @click="signInHandler"
        class="
          px-4
          py-2
          rounded
          border
          border-solid
          border-gra-200
          hover:bg-gray-200
          focus:active:border-gray-400
        ">
          Войти
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import InputComponent from '@/components/Input.vue';

  import { AuthenticationPayload } from '@/core/domain/authentication';

  import useAuthenticationApi from '@/core/api/authetication';
  import useAuthenticationStore from '@/core/store/authentication';

  export default defineComponent({
    name: 'AuthenticationScreen',
    components: {
      InputComponent,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();

      const authenticationApi = useAuthenticationApi();
      const authenticationStore = useAuthenticationStore();

      const form = reactive<Record<keyof AuthenticationPayload, string>>({
        username: '',
        password: '',
      });

      async function signInHandler() {
        const token = await authenticationApi.signIn({
          username: form.username,
          password: form.password,
        });

        authenticationStore.setAuthenticationToken(token);

        await router.push(String(route.query.redirect) || '/');
      }

      return {
        form,

        signInHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
