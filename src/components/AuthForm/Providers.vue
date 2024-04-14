<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { GSymbol } from 'vue-material-symbols';
  import { isAxiosError } from 'axios';
  import { ElMessage } from 'element-plus';

  import useAuthStore from '@/store/auth.ts';
  import useClientStore from '@/store/client.ts';

  export default defineComponent({
    name: 'AuthFormProviders',
    components: {
      GSymbol,
    },
    setup() {
      let outerWindow: Window | null = null;

      const router = useRouter();
      const route = useRoute();

      const clientStore = useClientStore();
      const authStore = useAuthStore();

      const isSigningIn = ref<boolean>(false);

      function parseMessageDataHandler(data: MessageEvent['data']): string {
        try {
          // В postMessage от бекенда ожидается json
          // Поле token - авторизация прошла успешно
          // Поле error - ошибка авторизации и её детали внутри поля
          const parsedData = JSON.parse(data);

          if (parsedData.error) {
            throw new Error('Ошибка авторизации');
          } else {
            return parsedData.token;
          }
        } catch (error) {
          if (!(error instanceof SyntaxError)) throw error;

          throw new Error('Ошибка обработка ответа от сервера');
        }
      }

      async function outerWindowMessageHandler(event: MessageEvent) {
        // Добавлено для предотвращение прослушивания "чужих" сообщений (от расширений devtools) во время разработки
        if (import.meta.env.DEV && event.origin === window.origin) return;

        if (!outerWindow) return;

        try {
          isSigningIn.value = true;

          // Достаем токен из сообщения, отправленного через postMessage
          authStore.token = parseMessageDataHandler(event.data);

          // Логика обработки успешной авторизации
          if (route.query.return_to) {
            router.push(String(route.query.return_to)).catch(console.error);
          } else {
            router.push({
              name: 'reports',
            }).catch(console.error);
          }
        } catch (e) {
          if (e instanceof Error) {
            ElMessage.error(e.message);
          }
        } finally {
          // Отвязываем все слушатели, закрываем окно и удаляем ссылку на него
          window.removeEventListener('message', outerWindowMessageHandler);
          outerWindow.close();
          outerWindow = null;

          isSigningIn.value = false;
        }
      }

      function openOuterWindow(url: string) {
        if (!outerWindow) {
          // Если ранее не открывали окно (НЕ Safari) - открываем
          // Задаем размеры в 50% от ширины и высоты экрана (но не более 800x600)
          // Задаем позицию по центру экрана

          outerWindow = window.open(url, '_blank', 'popup=true');

          if (outerWindow) {
            const { innerWidth: width, outerHeight: height } = window;

            const outerWindowWidth = width < 800 ? width : 800;
            const outerWindowHeight = height < 600 ? height : 600;

            outerWindow.resizeTo(outerWindowWidth, outerWindowHeight);

            outerWindow.moveBy(
              width > outerWindowWidth ? Math.round((width - outerWindowWidth) / 2) : 0,
              height > outerWindowHeight ? Math.round((height - outerWindowHeight) / 2) : 0,
            );
          }
        } else {
          // Если ранее открывали окно (Safari) - задаем параметры

          outerWindow.location.href = url;
          outerWindow.opener = window;
        }

        // Добавляем слушатель на postMessage от бекенда
        window.addEventListener('message', outerWindowMessageHandler);
      }

      async function authWithTCSClickHandler() {
        isSigningIn.value = true;

        // Если окно уже было открыто и его закрыли вручную, мы не можем это отловить
        // Поэтому при каждом нажатии на кнопку проверяем наличие предыдущего окна
        // И закрываем его, в случае наличия
        if (outerWindow) {
          outerWindow.close();
          outerWindow = null;
        }

        // Safari не дает открывать окно из асинхронных функций после первого await
        // Поэтому открываем и присваиваем его в переменную заранее
        if (clientStore.browserInfo.isSafari) {
          outerWindow = window.open();
        }

        try {
          // Получаем ссылку на окно авторизации провайдера
          const authProviderUrl = await authStore.fetchAuthProviderUrl();

          openOuterWindow(authProviderUrl);
        } catch (error) {
          // В случае какой-либо ошибки в процессе получения ссылки или конфигурации окна
          // Закрываем предварительно открытое на Safari окно
          outerWindow?.close();
          outerWindow = null;

          if (!isAxiosError(error)) throw error;

          const { status } = error.response ?? {};

          if (status === 502) {
            ElMessage.error('Не удалось получить ответ от сервера');
          } else {
            throw error;
          }
        } finally {
          isSigningIn.value = false;
        }
      }

      return {
        authWithTCSClickHandler,
      };
    },
  });
</script>

<template>
  <div class="auth-providers">
    <p class="auth-providers__title">
      Или войдите с помощью
    </p>

    <el-button @click="authWithTCSClickHandler">
      <template #icon>
        <el-icon>
          <g-symbol
          fill
          icon="lock"
          :weight="700"/>
        </el-icon>
      </template>

      TrueConf Server
    </el-button>
  </div>
</template>

<style lang="scss">
  .auth-providers {
    display: flex;
    flex-flow: column nowrap;
    gap: 12px;
  }

  .auth-providers__title {
    padding-bottom: 6px;

    border-bottom: 1px solid var(--border-color-secondary);

    color: var(--text-color-secondary);
    text-align: center;
  }
</style>
