import { getDirectusItem } from '~~/server/services/directus/core';

interface ICmsRequestQuery {
    fields?: string;
    relations?: string;
    filter?: string;
    sort?: string;
}

export default defineCachedEventHandler(
    async (
        event
    ): Promise<{ success: boolean; data: unknown | null; status: number; message: string }> => {
        /** Query параметры запроса */
        const query = getQuery<ICmsRequestQuery>(event);

        /** Параметры collection и id из запроса */
        const { collection, id } = getRouterParams(event);
        if (!collection || !id) {
            setResponseStatus(event, 400);
            return {
                success: false,
                status: 400,
                data: null,
                message: 'Parameters "collection" & "id" is required',
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

            const params = {
                fields: fields ?? ['*', ...(relations ?? [])],
                filter,
                sort: query.sort,
            };

            /** Каст к any, поскольку в динамическом HTTP-API невозможно передать generic, рассчет на корректную типизацию клиента */
            const data = await getDirectusItem(collection as any, id, params);

            return { success: true, status: 200, data, message: 'OK' };
        } catch (err: any) {
            console.error('[api/cms/item] error', err);

            setResponseStatus(event, 500);
            return {
                success: false,
                status: 500,
                data: null,
                message: String(err?.message ?? err),
            };
        }
    },
    { maxAge: 60 }
);
