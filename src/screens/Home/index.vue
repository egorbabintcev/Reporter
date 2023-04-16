<template>
  <div class="home-screen flex--dir--vertical flex--grow ">
    <div class="home-screen-content flex--dir--vertical flex--grow flex--justify--center flex--align--center"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'HomeScreen',
  });
</script>

<style lang="scss">
  .home-screen {
    padding: 16px;
    overflow: hidden;
  }

  .home-screen-content {
    max-height: 100%;
    overflow: hidden;
  }
</style>
