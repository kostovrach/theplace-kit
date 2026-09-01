/**
 * Алиас для глобального состояния гидрации приложения.
 *
 * Состояние инициализируется в client-плагине `app/plugins/hydration.client.ts`
 * и однократно фиксируется в `true` после события {@link onNuxtReady}.
 *
 * @returns Флаг состояния гидрации приложения.
 */
export const useAppHydration = () => {
    return useState<boolean>('app-hydrated');
};
