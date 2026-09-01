import { readItems, readSingleton } from '@directus/sdk';
import { directus } from '~~/server/services/directus/client';

import type { Query, UnpackList } from '@directus/sdk';

/**
 * HTTP-обработчик для получения коллекции Directus.
 *
 * Обработчик принимает имя коллекции из параметра маршрута `collection`,
 * валидирует его относительно зарегистрированной CMS-схемы и выполняет соответствующий запрос к Directus:
 *
 * - для singleton-коллекции используется {@link readSingleton};
 * - для обычной коллекции используется {@link readItems}.
 *
 * Параметры запроса передаются через query string и преобразуются
 * {@link parseCmsQuery} в формат, совместимый с Directus SDK.
 *
 * Ответ приводится к единому формату {@link CmsResponse} с флагом успеха и HTTP-статусом.
 *
 * Результат обработчика кэшируется на 24 часа. При изменении соответствующего
 * контента Directus webhook может досрочно инвалидировать этот кэш.
 *
 * Ключ кэша формируется на основе имени коллекции, HTTP-метода и query-параметров,
 * поэтому различные варианты одного и того же endpoint с разными параметрами кэшируются независимо.
 *
 * @throws Ошибку валидации, если параметр `collection` отсутствует
 * или не соответствует имени зарегистрированной regular- или singleton-коллекции.
 *
 * @returns Promise с результатом запроса к Directus в формате {@link CmsResponse}.
 */
export default defineCachedEventHandler(
    async (event): Promise<CmsResponse> => {
        const log = createLogger('DirectusCollection');

        try {
            const collection = getRouterParam(event, 'collection');

            assertCollection(collection);

            const query = parseCmsQuery(getQuery(event));

            /**
             * Для singleton-коллекции выполняется запрос singletion объекта.
             *
             * Тип запроса связывается с конкретной коллекцией через {@link Schema},
             * что позволяет сохранить типизацию результата в соответствии со схемой Directus.
             */
            if (isSingletonCollection(collection)) {
                const res = await directus.request<Schema[typeof collection]>(
                    readSingleton(collection, query as Query<Schema, Schema[typeof collection]>)
                );

                setResponseStatus(event, 200);
                return { success: true, status: 200, data: res, message: 'OK' };
            }

            /**
             * Для regular коллекции выполняется запрос списка элементов.
             *
             * После проверки {@link assertCollection} значение `collection` гарантированно относится к допустимой regular коллекции.
             *
             * {@link UnpackList} извлекает тип отдельного элемента из типа списка,
             * позволяя корректно типизировать параметры запроса {@link Query} для {@link readItems}.
             */
            const res = await directus.request<Schema[typeof collection]>(
                readItems(collection, query as Query<Schema, UnpackList<Schema[typeof collection]>>)
            );

            setResponseStatus(event, 200);
            return { success: true, status: 200, data: res, message: 'OK' };
        } catch (err) {
            log.error('Failed to get collection from Directus:', err);
            throw err;
        }
    },
    {
        /**
         * Уникальное имя обработчика.
         *
         * Используется Nitro для идентификации кэшируемого обработчика.
         */
        name: 'cms-get-collection',

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
            const query = getQuery(event);
            return `collection-${collection}-${event.method}-${JSON.stringify(query)}`;
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
