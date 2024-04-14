<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import AuthFormProviders from './Providers.vue';
  import AuthFormSignIn from './SignIn.vue';
  import AuthFormSignUp from './SignUp.vue';

  export default defineComponent({
    name: 'AuthForm',
    components: {
      AuthFormProviders,
      AuthFormSignIn,
      AuthFormSignUp,
    },
    setup() {
      const route = useRoute();
      const router = useRouter();

      const action = computed(() => (route.query.action as 'sign_in' | 'sign_up') || 'sign_in');

      function switchToSignUpHandler() {
        router.push({
          query: {
            ...route.query,
            action: 'sign_up',
          },
        });
      }

      function switchToSignInHandler() {
        router.push({
          query: {
            ...route.query,
            action: 'sign_in',
          },
        });
      }

      return {
        action,

        switchToSignUpHandler,
        switchToSignInHandler,
      };
    },
  });
</script>

<template>
  <div class="auth-form">
    <AuthFormSignIn
    v-if="action === 'sign_in'"
    @switch-to-sign-up="switchToSignUpHandler"/>

    <AuthFormSignUp
    v-if="action === 'sign_up'"
    @switch-to-sign-in="switchToSignInHandler"/>

    <AuthFormProviders/>
  </div>
</template>

<style lang="scss">
  .auth-form {
    display: flex;
    flex-flow: column nowrap;
    gap: 32px;

    width: 100%;
    max-width: 340px;
    padding: 36px 24px;

    border: 1px solid var(--border-color-primary);
    border-radius: 6px;
  }
</style>
