import { getDirectusCollection } from '~~/server/services/directus/core';

interface ICmsRequestQuery {
    fields?: string;
    relations?: string;
    filter?: string;
    sort?: string;
    limit?: string | number;
}

export default defineCachedEventHandler(
    async (
        event
    ): Promise<{ success: boolean; data: unknown | null; status: number; message: string }> => {
        /** Query параметры запроса */
        const query = getQuery<ICmsRequestQuery>(event);

        /** Параметр collection из запроса */
        const { collection } = getRouterParams(event);
        if (!collection) {
            setResponseStatus(event, 400);
            return {
                success: false,
                status: 400,
                data: null,
                message: 'Parameter "collection" is required',
            };
        }

        try {
            /** Парсинг полей (fields) */
            let fields: string[] | undefined;
            if (query.fields) {
                const rawFields = query.fields.trim();
                if (rawFields.startsWith('[')) {
                    try {
                        fields = JSON.parse(rawFields);
                    } catch {}
                } else {
                    fields = rawFields
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);
                }
            }

            /** Парсинг связей (relations) */
            const relations = query.relations
                ? query.relations
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                : [];

            /** Парсинг фильтров (filter) */
            let filter: Record<string, unknown> | undefined;
            if (query.filter) {
                try {
                    filter =
                        typeof query.filter === 'string' ? JSON.parse(query.filter) : query.filter;
                } catch {
                    throw createError({
                        status: 400,
                        message: 'Invalid filter JSON syntax',
                    });
                }
            }

            /** Парсинг лимита (limit) */
            const limit = query.limit !== undefined ? Number(query.limit) : -1;

            const params = {
                fields: fields ?? ['*', ...(relations ?? [])],
                filter,
                sort: query.sort,
                limit,
            };

            /** Каст к any, поскольку в динамическом HTTP-API невозможно передать generic, рассчет на корректную типизацию клиента */
            const data = await getDirectusCollection(
                collection as CollectionNameType,
                params as any
            );

            return { success: true, status: 200, data, message: 'OK' };
        } catch (err: any) {
            console.error('[api/cms] error', err);

            setResponseStatus(event, 500);
            return {
                success: false,
                status: 500,
                data: null,
                message: String(err?.message ?? err),
            };
        }
    },
    {
        // Имя обработчика
        name: 'get-cms-collection',
        // Ключ кэша запроса
        getKey: (event) => {
            const collection = getRouterParam(event, 'collection');
            return `collection-${collection}`;
        },
        // Кэш на 24 часа
        // Если контент поменяется в CMS, вебхук Directus сбросит этот кэш досрочно
        maxAge: 60 * 60 * 24,
    }
);
