<template>
  <div class="popup-wrapper">
    <div
    class="popup">
      <div class="popup-header">
        <p
        v-if="headerText"
        v-html="headerText"
        class="popup-header__text">
        </p>

        <div class="popup__spacer"></div>

        <button
        @click="$emit('close')"
        class="popup-header__button">
          Close
        </button>
      </div>

      <div class="popup-content">
        <slot/>
      </div>

      <div class="popup-footer">
        <div class="popup__spacer"></div>

        <div class="main-row-12">
          <button
          @click="$emit('close')"
          class="popup-footer__button">
            Cancel
          </button>

          <button
          @click="$emit('confirm')"
          class="popup-footer__button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { PropType } from 'vue';

  import { HTMLString } from '@/shared-kernel';

  export default {
    name: 'PopupComponent',
    props: {
      headerText: {
        type: String as PropType<HTMLString>,
      },
    },
  };
</script>

<style lang="scss">
  @use '@/styles/variables';

  .popup-wrapper {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    position: fixed;
    top: 0;
    left: 0;

    background-color: rgba(variables.$dark-color, 0.32);
  }

  .popup {
    display: flex;
    flex-flow: column nowrap;

    max-width: 90vw;
    max-height: 90vh;
    padding: 16px;

    background-color: variables.$light-color;
  }

  .popup__spacer {
    flex-grow: 1;

    margin: 0 !important;
  }

  .popup-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  .popup-content {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;

    overflow: hidden;
  }

  .popup-footer {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
</style>
