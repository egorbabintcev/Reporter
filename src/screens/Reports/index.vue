<template>
  <div class="reports-screen">
    <div class="reports-screen-content"></div>
  </div>
</template>

<script>
export default {
  name: 'ReportsScreen',
  data: () => ({

  }),
};
</script>

<style lang="scss">
  @use '@/styles/modules/screen' as *;

  .reports-screen {
    @extend %screen;
  }

  .reports-screen-content {
    @extend %screen-content;
  }
</style>
