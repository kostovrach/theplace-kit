import { readItem } from '@directus/sdk';
import { directus } from '~~/server/services/directus/client';

import type { Query, UnpackList } from '@directus/sdk';

/**
 * HTTP-обработчик для получения отдельного элемента обычной коллекции Directus.
 *
 * Имя коллекции и ID элемента извлекаются из параметров маршрута `collection` и `id`.
 * Перед выполнением запроса оба параметра проходят валидацию относительно зарегистрированной CMS-схемы.
 *
 * В отличие от обработчика получения коллекции, данный endpoint предназначен
 * только для regular- коллекций. Попытка обратиться к singleton-коллекции
 * приводит к ошибке HTTP `400`.
 *
 * Параметры запроса передаются через query string и преобразуются
 * {@link parseCmsQuery} в формат, совместимый с Directus SDK.
 *
 * Ответ приводится к единому формату {@link ICmsResponse} с флагом успеха и HTTP-статусом.
 *
 * Результат обработчика кэшируется на 24 часа. При изменении соответствующего
 * контента Directus webhook может досрочно инвалидировать этот кэш.
 *
 * Ключ кэша формируется на основе имени коллекции, HTTP-метода и query-параметров,
 * поэтому различные варианты одного и того же endpoint с разными параметрами кэшируются независимо.
 *
 * @throws Ошибку валидации, если `collection` отсутствует или не соответствует
 * допустимому имени коллекции.
 * @throws HTTP `400`, если параметр `id` отсутствует или пуст.
 * @throws HTTP `400`, если указанная коллекция является singleton-коллекцией.
 *
 * @returns Promise с результатом запроса к Directus в формате {@link ICmsResponse}.
 */
export default defineCachedEventHandler(
    async (event): Promise<ICmsResponse> => {
        const log = createLogger('DirectusItem');

        try {
            const collection = getRouterParam(event, 'collection');
            const id = getRouterParam(event, 'id');

            assertCollection(collection);

            if (!id || !id.length) {
                log.error('Missing ID');
                throw createError({
                    status: 400,
                    message: 'Parameter "id" is required',
                });
            }

            const query = parseCmsQuery(getQuery(event));

            /**
             * Проверка, является ли указанная коллекция regular-коллекцией.
             *
             * Только regular-коллекции поддерживают получение отдельного элемента через {@link readItem}.
             * Для singleton-коллекций используется другой API-метод Directus, поэтому такие запросы отклоняются.
             */
            if (isRegularCollection(collection)) {
                const res = await directus.request<Schema[typeof collection]>(
                    readItem(
                        collection,
                        id,
                        query as Query<Schema, UnpackList<Schema[typeof collection]>>
                    )
                );

                setResponseStatus(event, 200);
                return { success: true, status: 200, data: res, message: 'OK' };
            } else {
                /**
                 * Singleton-коллекции не поддерживают получение элемента по `id`.
                 *
                 * Такой запрос считается некорректным для данного endpoint и завершается HTTP-ошибкой `400`.
                 */
                log.error('Parameter "collection" must be the name of regular collection');
                throw createError({
                    status: 400,
                    message: 'Parameter "collection" must be the name of regular collection',
                });
            }
        } catch (err) {
            log.error('Failed to get item from Directus:', err);
            throw err;
        }
    },
    {
        /**
         * Уникальное имя обработчика.
         *
         * Используется Nitro для идентификации кэшируемого обработчика.
         */
        name: 'cms-get-item',

        /**
         * Формирование уникального ключа для кэша ответа (для доступа при досрочной инвалидации).
         *
         * В ключ включаются:
         * - имя запрашиваемой коллекции;
         * - HTTP-метод;
         * - сериализованные query-параметры.
         */
        getKey: (event) => {
            const collection = getRouterParam(event, 'collection');
            const id = getRouterParam(event, 'id');
            const query = getQuery(event);
            return `collection-${collection}-item-${id}-${event.method}-${JSON.stringify(query)}`;
        },

        // TODO: сделать ссылку на страницу cookbook про настройку вебхуков в directus для досрочной инвалидации кэша
        /**
         * Максимальное время хранения ответа в кэше 24 часа.
         *
         * Фактический срок актуальности данных может быть меньше,
         * если настроено получение Directus webhooks для инвалидации кэша при редактировании коллекций
         */
        maxAge: 60 * 60 * 24,
    }
);
