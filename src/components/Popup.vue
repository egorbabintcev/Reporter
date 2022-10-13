<template>
  <div class="flex flex-col justify-center items-center w-full h-full fixed top-0 left-0 bg-black/30">
    <div
    class="popup flex flex-col max-w-[90vw] max-h-[90vh] p-6 bg-white rounded-md">
      <div class="flex flex-col flex-grow gap-6">
        <div class="flex flex-row flex-nowrap overflow-hidden items-center">
          <p
          v-if="headerText"
          v-html="headerText"
          class="text-2xl text-gray-800 font-semibold truncate"/>

          <div class="flex-grow"/>

          <button
          @click="$emit('close')"
          class="
            px-4
            py-2
            rounded
            border
            hover:bg-gray-100
            focus:active:border-gray-400
          ">
            Закрыть
          </button>
        </div>

        <div class="flex flex-col flex-grow overflow-hidden">
          <slot/>
        </div>

        <div class="flex flex-row flex-nowrap overflow-hidden items-center">
          <div class="flex-grow"/>

          <div class="flex gap-3">
            <button
            @click="$emit('close')"
            class="
              px-4
              py-2
              rounded
              border
              hover:bg-gray-100
              focus:active:border-gray-400
            ">
              Отмена
            </button>

            <button
            @click="$emit('confirm')"
            class="
              px-4
              py-2
              rounded
              border
              hover:bg-gray-100
              focus:active:border-gray-400
            ">
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent, onBeforeMount, onBeforeUnmount, PropType,
  } from 'vue';

  import { HTMLString } from '@/shared-kernel';

  export default defineComponent({
    name: 'PopupComponent',
    emits: ['close', 'confirm'],
    props: {
      headerText: {
        type: String as PropType<HTMLString>,
        default: '',
      },
    },
    setup(_, { emit }) {
      function keyupHandler(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          emit('close');
        }

        if (event.key === 'Enter') {
          emit('confirm');
        }
      }

      onBeforeMount(() => {
        window.addEventListener('keyup', keyupHandler);
      });

      onBeforeUnmount(() => {
        window.removeEventListener('keyup', keyupHandler);
      });
    },
  });
</script>

<style lang="scss">

</style>
