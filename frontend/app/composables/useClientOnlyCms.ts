export async function useClientOnlyCms<T = any>(
    collection: string,
    withRelations: string[] = [],
    opts: { resolveFiles?: boolean } = {}
) {
    const query = {
        relations: withRelations.join(','),
        resolveFiles: opts.resolveFiles ?? true,
    };

    const data = await $fetch<{ data: T }>(`/api/cms/${collection}`, { query });

    return {
        content: computed(() => data.data ?? null),
    };
}
