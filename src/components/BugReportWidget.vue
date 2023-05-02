<template>
  <div class="bug-report-widget">
    <el-popover
    :width="480">
      <template #reference>
        <el-button
        @click="bugReportHandler"
        plain
        round
        type="danger">
          <template #icon>
            <el-icon
            size="20">
              <g-symbol
              :grade="-25"
              icon="contact_support"/>
            </el-icon>
          </template>

          Обратная связь
        </el-button>
      </template>

      <div class="bug-report-widget-content flex--dir--vertical flex--gap--8">
        <p class="bug-report-widget__text">
          Наш продукт находится на ранней стадии развития и активно отлаживается.
        </p>
        <p class="bug-report-widget__text">
          Также мы принимаем пожелания, касающиеся необходимой для пользователей функциональности.
        </p>
        <p class="bug-report-widget__text">
          Будем рады любому фидбеку) Спасибо что пользуетесь нашим приложением!
        </p>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { GSymbol } from 'vue-material-symbols';

  export default defineComponent({
    name: 'BugReportWidget',
    components: {
      GSymbol,
    },
    setup() {
      function bugReportHandler() {
        const link = document.createElement('a');

        link.href = 'mailto:babintsev@trueconf.ru,ovsienko@trueconf.ru?subject=Reporter bug report';

        link.click();
        link.remove();
      }

      return {
        bugReportHandler,
      };
    },
  });
</script>

<style lang="scss">
  .bug-report-widget__text {
    line-height: 1.3;
    text-align: left;
    white-space: normal;
    word-break: normal;
  }
</style>
