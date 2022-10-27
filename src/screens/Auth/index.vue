<template>
  <div class="flex flex-grow flex-row justify-center bg-violet-700">
    <div
    class="
      flex
      flex-grow
      flex-row
      justify-center
      xl:justify-between
      items-center
      max-w-screen-xl
      py-16
      px-12
      xl:pl-28
    ">
      <component
      :is="authFormComponent"/>

      <img
      :src="illustration"
      class="
        hidden
        xl:block

        w-[670px]

        object-contain
      ">
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useRoute } from 'vue-router';

  import AuthSignInForm from './AuthSignInForm.vue';
  import AuthSignUpForm from './AuthSignUpForm.vue';

  import illustration from './assets/illustration.svg';

  export default defineComponent({
    name: 'AuthScreen',
    setup() {
      const route = useRoute();

      const authAction = computed(() => (route.query.action as 'sign_in' | 'sign_up') || 'sign_in');
      const authFormComponent = computed(() => (authAction.value === 'sign_in'
        ? AuthSignInForm
        : AuthSignUpForm));

      return {
        authAction,
        authFormComponent,
        illustration,
      };
    },
  });
</script>

<style lang="scss">

</style>
