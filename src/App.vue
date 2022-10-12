<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'App',
  });
</script>

<style lang="scss">
  .app {
    display: flex;
    flex-flow: column nowrap;

    min-height: 100vh;
    overflow: hidden;
  }
</style>
