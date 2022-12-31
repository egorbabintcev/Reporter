<template>
  <div
  @click="logoutHandler"
  class="
    flex
    flex-row
    items-center
    gap-2
    mt-auto

    opacity-40
    cursor-pointer
    transition-opacity

    hover:opacity-100
  ">
    <IconComponent
    class="w-[3rem] h-[3rem] text-white text-[3rem]"
    icon="logout"/>

    <p class="text text-lg text-white">
      Выход
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';

  import IconComponent from '@/components/Icon.vue';

  import useAuthStore from '@/core/store/auth';

  export default defineComponent({
    name: 'TheSidebarProfileActions',
    components: {
      IconComponent,
    },
    setup() {
      const router = useRouter();

      const authStore = useAuthStore();

      async function logoutHandler() {
        authStore.setAuthToken(null);

        await router.push({
          name: 'auth',
          query: {
            actions: 'sign_in',
          },
        });
      }

      return {
        logoutHandler,
      };
    },
  });
</script>

<style lang="scss">

</style>
