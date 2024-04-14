<script lang="ts">
  import { defineComponent } from 'vue';
  import { GSymbol } from 'vue-material-symbols';

  import useTheme from '@/hooks/useTheme.ts';

  export default defineComponent({
    name: 'ThemeSwitcher',
    components: { GSymbol },
    setup() {
      const { theme, setTheme } = useTheme();

      function toggleDarkThemeHandler(enable: boolean) {
        setTheme(enable ? 'dark' : 'light');
      }

      return {
        theme,

        toggleDarkThemeHandler,
      };
    },
  });
</script>

<template>
  <div class="theme-switcher">
    <el-icon
    class="theme-switcher__icon"
    :size="18">
      <g-symbol
      fill
      icon="light_mode"/>
    </el-icon>

    <el-switch
    @update:model-value="toggleDarkThemeHandler(!!$event)"
    :modelValue="theme === 'dark'"/>

    <el-icon
    class="theme-switcher__icon"
    :size="18">
      <g-symbol
      fill
      icon="dark_mode"/>
    </el-icon>
  </div>
</template>

<style lang="scss">
  .theme-switcher {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 8px;
  }

  .theme-switcher__icon {
    color: var(--text-color-primary);
  }
</style>
