<template>
  <div class="auth-screen">
    <AuthForm/>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useRoute } from 'vue-router';

  import AuthForm from '@/components/AuthForm/index.vue';

  export default defineComponent({
    name: 'AuthScreen',
    components: {
      AuthForm,
    },
    setup() {
      const route = useRoute();

      const authAction = computed(() => (route.query.action as 'sign_in' | 'sign_up') || 'sign_in');

      return {
        authAction,
      };
    },
  });
</script>

<style lang="scss">
  .auth-screen {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  /* .auth-form__container {
    width: 100%;
    max-width: 768px;
    min-height: 400px;
    padding: 32px;

    border: 1px solid rgba(0 0 0 / 0.14);
    border-radius: 4px;
  }

  .auth-form {
    display: flex;
    flex-flow: row nowrap;

    height: 100%;
  }

  .auth-form__inputs {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    justify-content: center;
    gap: 12px;

    max-width: 40%;
  }

  .auth-form__separator {
    width: 1px;
    margin: 0 auto;

    background-color: rgba(0 0 0 / 0.14);
  }

  .auth-form__hint {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    justify-content: center;

    max-width: 40%;
  }

  .auth-form__hint-text {
    color: rgba(0 0 0 / 0.54);
  }

  .auth-form__hint-text--link {
    color: #40a9ff;

    cursor: pointer;
  } */
</style>
