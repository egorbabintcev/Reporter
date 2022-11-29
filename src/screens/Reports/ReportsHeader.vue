<template>
  <div class="flex flex-col gap-1.5">
    <h1 class="text-xl font-bold text-gray-800">
      {{ greetingText }}
    </h1>

    <h2 class="text-lg text-gray-600">
      Здесь ты можешь просматривать и редактировать свои отчеты (а в будущем статистику и прочие плюшки 😊)
    </h2>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import useProfileStore from '@/core/store/profile';

  export default defineComponent({
    name: 'ReportsHeader',
    setup() {
      const profileStore = useProfileStore();

      const greetingText = computed<string>(() => {
        if (profileStore.profile) {
          return `Добро пожаловать, ${profileStore.profile.displayName}!`;
        }

        return `Добро пожаловать!`;
      });

      return {
        greetingText,
      };
    },
  });
</script>

<style lang="scss">

</style>
