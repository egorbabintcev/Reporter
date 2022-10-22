<template>
  <span class="icon material-icons">
    {{ icon }}
  </span>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'IconComponent',
    props: {
      icon: {
        type: String,
        required: true,
      },
    },
  });
</script>

<style lang="scss">

</style>
