/**
 * Инициализация глобального состояния гидрации приложения.
 *
 * Создание состояния `app-hydrated` со значением `false` и последующее
 * переключение значения в `true` после первой готовности Nuxt-приложения.
 */
export default defineNuxtPlugin(() => {
    const isHydrated = useState('app-hydrated', () => false);

    onNuxtReady(() => {
        isHydrated.value = true;
    });
});
