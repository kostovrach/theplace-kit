import { readItem } from '@directus/sdk';
import { directus } from '~~/server/services/directus/client';

import type { Query, UnpackList } from '@directus/sdk';

export default defineCachedEventHandler(
    async (event): Promise<ICmsResponse> => {
        const collection = getRouterParam(event, 'collection');
        const id = getRouterParam(event, 'id');

        /**
         * Проверка наличия ключа коллекции
         * и его соответствия названию любой из регулярных или singleton коллекций.
         * В ином случае функция пробросит ошибку
         */
        assertCollection(collection);

        if (!id || !id.length) {
            throw createError({
                status: 400,
                message: 'Parameter "id" is required',
            });
        }

        const query = parseCmsQuery(getQuery(event));

        /** Если переданный ключ является ключом регулярной коллекции */
        if (isRegularCollection(collection)) {
            const res = await directus.request<Schema[typeof collection]>(
                readItem(
                    collection,
                    id,
                    query as Query<Schema, UnpackList<Schema[typeof collection]>>
                )
            );
            return { success: true, status: 200, data: res, message: 'OK' };
        } else {
            throw createError({
                status: 400,
                message: 'Parameter "collection" must be the name of regular collection',
            });
        }
    },
    {
        // Имя обработчика
        name: 'cms-get-item',
        // Ключ кэша запроса
        getKey: (event) => {
            const collection = getRouterParam(event, 'collection');
            const id = getRouterParam(event, 'id');
            const query = getQuery(event);
            return `collection-${collection}-item-${id}-${event.method}-${JSON.stringify(query)}`;
        },
        // Кэш на 24 часа
        // Если контент поменяется в CMS, вебхук Directus сбросит этот кэш досрочно
        maxAge: 60 * 60 * 24,
    }
);
