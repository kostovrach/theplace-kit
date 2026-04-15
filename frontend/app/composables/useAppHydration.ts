/**
 * Алиас для глобального стейта
 * - инициализация в `app/plugins/hydration.client.ts`
 */
export const useAppHydration = () => {
    return useState<boolean>('app-hydrated');
};
