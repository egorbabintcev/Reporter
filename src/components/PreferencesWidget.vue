<template>
  <div class="preferences-widget">
    <el-button
    @click="showPreferencesPopup = true"
    circle>
      <template #icon>
        <el-icon
        size="20">
          <g-symbol
          :grade="-25"
          icon="settings"
          type="rounded"
          :weight="400"/>
        </el-icon>
      </template>
    </el-button>

    <el-dialog
    v-model="showPreferencesPopup"
    alignCenter
    centered
    title="Настройка предпочтений"
    width="580">
      <div class="flex--dir--horizontal flex--justify--between flex--align--center">
        <p class="preferences-widget-popup__text">
          Раскладка редактора отчетов:
        </p>

        <el-radio-group
        v-model="sidebarPosition">
          <el-radio-button
          label="left">
            Календарь слева
          </el-radio-button>

          <el-radio-button
          label="right">
            Календарь справа
          </el-radio-button>
        </el-radio-group>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { storeToRefs } from 'pinia';

  import { GSymbol } from 'vue-material-symbols';

  import usePreferencesStore from '@/store/preferences';

  export default defineComponent({
    name: 'PreferencesWidget',
    components: {
      GSymbol,
    },
    setup() {
      const showPreferencesPopup = ref(false);

      const preferencesStore = usePreferencesStore();
      const preferencesStoreRefs = storeToRefs(preferencesStore);

      const sidebarPosition = computed({
        get(): 'left' | 'right' {
          return preferencesStoreRefs.preferences.value.sidebarPosition;
        },
        set(value: 'left' | 'right') {
          preferencesStore.setPreferences({
            sidebarPosition: value,
          });
        },
      });

      return {
        showPreferencesPopup,
        sidebarPosition,
      };
    },
  });
</script>

<style lang="scss">
  .preferences-widget-popup__text {
    font-weight: 700;
    color: rgba(0 0 0 / 0.54);
  }
</style>
