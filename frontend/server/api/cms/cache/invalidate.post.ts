const LOG_PREFIX = '[CmsCache]';

/**
 * Обработчик webhook для досрочного сброса кэша CMS.
 *
 * Endpoint предназначен для вызова из Directus после изменения содержимого коллекции.
 * В теле запроса передается имя измененной коллекции, после чего
 * обработчик удаляет все кэшированные ответы, относящиеся к этой коллекции.
 *
 * Доступ к endpoint защищен общим секретом, который передается в HTTP-заголовке
 * `x-webhook-secret` и сравнивается со значением `directus.webhookSecret`
 * из runtime-конфигурации приложения.
 *
 * Обработчик возвращает HTTP `401`, если секрет отсутствует или не совпадает,
 * HTTP `400`, если имя коллекции не передано, HTTP `500` при ошибке работы
 * с хранилищем кэша и HTTP `200` после успешного удаления кэшированных записей.
 *
 * @returns Promise с результатом выполнения операции, содержащий флаг успешности, HTTP-статус и текстовое сообщение.
 */
export default defineEventHandler(
    async (event): Promise<{ success: boolean; status: number; message: string }> => {
        const config = useRuntimeConfig();

        const secretHeader = getHeader(event, 'x-webhook-secret');
        const webhookSecret = config.directus.webhookSecret;

        if (!webhookSecret.length || secretHeader !== webhookSecret) {
            setResponseStatus(event, 401);

            logger('error', LOG_PREFIX, 'Unauthorized: Invalid webhook secret');
            return { success: false, status: 401, message: 'Unauthorized: Invalid webhook secret' };
        }
        
        /**
         * Имя коллекции, содержимое которой было изменено в Directus.
         *
         * Согласно контракту webhook, тело запроса содержит только
         * строковое имя коллекции без дополнительной структуры.
         */
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
            const cache = useStorage('cache');

            /**
             * Все ключи кэша CMS, зарегистрированные в хранилище Nitro.
             *
             * Пространство ключей ограничивается префиксом
             * `nitro:handlers:cms`, соответствующим кэшируемым CMS-обработчикам.
             */
            const allKeys = await cache.getKeys('nitro:handlers:cms');

            /**
             * Ключи кэша, относящиеся к изменённой коллекции.
             *
             * Кэшированные ответы для коллекции могут соответствовать как
             * запросу всей коллекции, так и запросам отдельных элементов.
             * Поэтому удаляются все ключи, содержащие идентификатор коллекции.
             */
            const keysToRemove = allKeys.filter((key) => key.includes(`collection-${collection}`));

            await Promise.all(keysToRemove.map((key) => cache.removeItem(key)));

            logger(
                'warn',
                LOG_PREFIX,
                `Successfully cleared ${keysToRemove.length} cache entries for collection: "${collection}"`
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
