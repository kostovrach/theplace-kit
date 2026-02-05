export async function useCmsItem<T = any>(
    collection: string,
    id: string | number,
    withRelations: string[] = [],
    opts: { resolveFiles?: boolean; force?: boolean; key?: string } = {}
) {
    const key = opts.key ?? `cms-item:${collection}:${id}:${JSON.stringify(withRelations)}`;

    const query = {
        relations: withRelations.join(','),
        resolveFiles: opts.resolveFiles ?? true,
    };

    const { data, status, refresh } = await useFetch<{ data: T }>(`/api/cms/${collection}/${id}`, {
        key,
        query,
        server: true,
        immediate: !opts.force,
    });

    return {
        item: computed(() => data.value?.data ?? null),
        status,
        refresh,
    };
}
