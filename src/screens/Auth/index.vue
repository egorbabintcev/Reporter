<template>
  <div class="auth-screen">
    <AuthForm/>

    <theme-switcher
    class="auth-screen__theme-switcher"/>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useRoute } from 'vue-router';

  import ThemeSwitcher from '@/components/ThemeSwitcher';

  import AuthForm from '@/components/AuthForm/index.vue';

  export default defineComponent({
    name: 'AuthScreen',
    components: {
      ThemeSwitcher,
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

    position: relative;

    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  .auth-screen__theme-switcher {
    position: absolute;
    top: 24px;
    right: 32px;
  }
</style>
