const LOG_PREFIX = '[CmsCache]';

export default defineEventHandler(
    async (event): Promise<{ success: boolean; status: number; message: string }> => {
        const config = useRuntimeConfig();

        const secretHeader = getHeader(event, 'x-webhook-secret');
        const webhookSecret = config.directus.webhookSecret;

        /** Проверка подписи вебхука */
        if (!webhookSecret.length || secretHeader !== webhookSecret) {
            setResponseStatus(event, 401);
            logger('error', LOG_PREFIX, 'Unauthorized: Invalid webhook secret');
            return { success: false, status: 401, message: 'Unauthorized: Invalid webhook secret' };
        }

        /** Контракт, что в теле запроса передается только название коллекции */
        const collection = await readBody<string | undefined>(event);

        if (!collection) {
            setResponseStatus(event, 400);
            logger('warn', LOG_PREFIX, 'Bad Request: Collection name is missing');
            return {
                success: false,
                status: 400,
                message: 'Bad Request: Collection name is missing',
            };
        }

        try {
            /** Глобальное хранилище кэша Nuxt */
            const cache = useStorage('cache');
            /**
             * Ключ формируется по шаблону `[группа]:[имя]:[ключ_запроса].json`
             * - Пространство имен: `nitro:handlers`
             * - Имя обработчика: `get-cms-collection`
             * - Ключ запроса: `collection-${collection}`
             */
            const key = `nitro:handlers:get-cms-collection:collection-${collection}.json`;

            await cache.removeItem(key);

            logger(
                'warn',
                LOG_PREFIX,
                `Successfully cleared cache for collection: "${collection}"`
            );

            setResponseStatus(event, 200);
            return { success: true, status: 200, message: 'OK' };
        } catch (err) {
            logger('error', LOG_PREFIX, 'Error clearing Nitro cache:', err);

            setResponseStatus(event, 500);
            return { success: false, status: 500, message: 'Internal Server Error' };
        }
    }
);
