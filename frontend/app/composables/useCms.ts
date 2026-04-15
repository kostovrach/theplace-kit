import type { AsyncDataOptions } from '#app';

type CmsQuery = {
    fields?: string[] | string;
    filter?: Record<string, any>;
    sort?: string;
    limit?: number;
};

export async function useCms<T = any>(
    collection: string,
    withRelations: string[] = [],
    requestOpt?: AsyncDataOptions<{ data: T }>,
    opts: {
        /** @deprecated */
        resolveFiles?: boolean;
        force?: boolean;
        key?: string;
        cacheTtl?: number;
        query?: CmsQuery;
    } = {}
) {
    const key =
        opts.key ??
        `cms:${collection}:${JSON.stringify(withRelations)}:${JSON.stringify(requestOpt ?? 'none-options')}:${JSON.stringify(opts.query ?? 'no-query')}`;

    const query: Record<string, any> = {
        relations: withRelations.join(','),
        resolveFiles: opts.resolveFiles ?? true,
    };

    if (opts.query) {
        if (opts.query.fields) {
            query.fields = Array.isArray(opts.query.fields)
                ? opts.query.fields.join(',')
                : opts.query.fields;
        }

        if (opts.query.filter) {
            query.filter = JSON.stringify(opts.query.filter);
        }

        if (opts.query.sort) {
            query.sort = opts.query.sort;
        }

        if (opts.query.limit !== undefined) {
            query.limit = opts.query.limit;
        }
    }

    const { data, status, refresh } = await useFetch<{ data: T }>(`/api/cms/${collection}`, {
        key,
        query,
        server: true,
        getCachedData(key, nuxtApp) {
            return nuxtApp.payload.data?.[key];
        },
        immediate: true,
        ...requestOpt,
    });

    return {
        content: computed(() => data.value?.data ?? null),
        status,
        refresh,
    };
}
