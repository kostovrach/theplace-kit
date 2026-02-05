import type { AsyncDataOptions } from '#app';

export async function useCms<T = any>(
    collection: string,
    withRelations: string[] = [],
    requestOpt?: AsyncDataOptions<{ data: T }>,
    opts: { resolveFiles?: boolean; force?: boolean; key?: string; cacheTtl?: number } = {}
) {
    const key =
        opts.key ??
        `cms:${collection}:${JSON.stringify(withRelations)}:${requestOpt ?? 'none-options'}`;
    const query = {
        relations: withRelations.join(','),
        resolveFiles: opts.resolveFiles ?? true,
    };

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
