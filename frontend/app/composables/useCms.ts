import type { AsyncDataOptions } from '#app';

export function useCms<T = any>(
    collection: string,
    withRelations: string[] = [],
    requestOpt?: AsyncDataOptions<any>,
    opts: { resolveFiles?: boolean; force?: boolean; key?: string; cacheTtl?: number } = {}
) {
    const key = opts.key ?? `cms:${collection}:${JSON.stringify(withRelations)}`;
    const query = {
        relations: withRelations.join(','),
        resolveFiles: opts.resolveFiles ?? true,
    };

    const { data, status, refresh } = useFetch<{ data: T }>(`/api/cms/${collection}`, {
        key,
        query,
        server: true,
        getCachedData(k, nuxtApp) {
            return nuxtApp.payload.data?.[k];
        },
        immediate: !opts.force,
        ...requestOpt,
    });

    return {
        content: computed(() => data.value?.data ?? null),
        status,
        refresh,
    };
}
