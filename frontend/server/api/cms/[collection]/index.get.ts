import { readItems, readSingleton } from '@directus/sdk';
import { directus } from '~~/server/services/directus/client';

import type { Query, UnpackList } from '@directus/sdk';

export default defineCachedEventHandler(
    async (event): Promise<ICmsResponse> => {
        const collection = getRouterParam(event, 'collection');

        /**
         * Проверка наличия ключа коллекции
         * и его соответствия названию любой из регулярных или singleton коллекций.
         * В ином случае функция пробросит ошибку
         */
        assertCollection(collection);

        const query = parseCmsQuery(getQuery(event));

        /** Если переданный ключ является ключом singleton коллекции */
        if (isSingletonCollection(collection)) {
            const res = await directus.request<Schema[typeof collection]>(
                readSingleton(collection, query as Query<Schema, Schema[typeof collection]>)
            );
            return { success: true, status: 200, data: res, message: 'OK' };
        }

        /** В ином случае ключ является именем регулярной коллекции, поскльку assertCollection не допустит невалидное значение */
        const res = await directus.request<Schema[typeof collection]>(
            readItems(collection, query as Query<Schema, UnpackList<Schema[typeof collection]>>)
        );
        return { success: true, status: 200, data: res, message: 'OK' };
    },
    {
        // Имя обработчика
        name: 'cms-get-collection',
        // Ключ кэша запроса
        getKey: (event) => {
            const collection = getRouterParam(event, 'collection');
            const query = getQuery(event);
            return `collection-${collection}-${event.method}-${JSON.stringify(query)}`;
        },
        // Кэш на 24 часа
        // Если контент поменяется в CMS, вебхук Directus сбросит этот кэш досрочно
        maxAge: 60 * 60 * 24,
    }
);
