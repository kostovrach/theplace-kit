import type { AsyncDataOptions, AsyncDataRequestStatus } from '#app';
import type { Query, UnpackList } from '@directus/sdk';

/**
 * Alias for the standard Directus SDK query type,
 * bound to a specific schema collection.
 * @template C - Collection name from `Schema`
 */
type LocalQueryType<C extends CollectionNameType> = Query<Schema, UnpackList<Schema[C]>>;

/**
 * Parameters for requests to the Directus server proxy.
 * Mirrors the main `Query` fields from `@directus/sdk`, bound to a specific collection.
 * @template C - Collection name from `Schema`
 */
interface IUseCmsParams<C extends CollectionNameType> {
    /**
     * List of fields to return.
     * Supports object syntax for nested relations.
     * @example
     * ['*', { cover: ['*'], author: ['id', 'name'] }]
     */
    fields?: LocalQueryType<C>['fields'];

    /**
     * Record filter (`Directus Filter` syntax).
     * @example
     * { status: { _eq: 'published' } }
     */
    filter?: LocalQueryType<C>['filter'];

    /**
     * Sort order.
     * The `-` prefix indicates descending order.
     * @example
     * ['-date_created', 'title']
     */
    sort?: LocalQueryType<C>['sort'];

    /**
     * Maximum number of items to return.
     * - `-1`: no limit (Directus behavior).
     */
    limit?: number;

    /**
     * Offset from the beginning of the result set (pagination).
     */
    offset?: number;

    /**
     * Page number (alternative to `offset`).
     * - Calculation: `offset = (page - 1) * limit`
     */
    page?: number;

    /**
     * Full-text search across the collection's searchable fields.
     */
    search?: string;

    /**
     * Parameters for filtering, sorting, and limiting nested relations.
     */
    deep?: LocalQueryType<C>['deep'];
}

/**
 * Unified composable response.
 * @template T - Type of data expected in `content`
 */
interface IUseCmsResponse<T> {
    /**
     * Reactive collection, item, or singleton data. `null` when:
     * - the request has not completed yet;
     * - the request failed;
     * - the API returned `success: false`.
     */
    content: Ref<T | null>;

    /**
     * Error message, if any, or `null`.
     */
    error: Ref<string | null>;

    /**
     * Current request status (`idle` | `pending` | `success` | `error`).
     */
    status: Ref<AsyncDataRequestStatus>;

    /**
     * Force the request to be executed again.
     */
    refresh: () => Promise<void>;
}

/**
 * Converts typed SDK query parameters into a string representation
 * for an HTTP request to `/api/cms/...`.
 * @template C - Collection name
 * @param params - Request parameters
 * @returns An object ready to be passed to `$fetch` as `query`
 */
function buildQuery<C extends CollectionNameType>(
    params: IUseCmsParams<C> = {}
): Record<string, string> {
    const query: Record<string, string> = {};

    if (params.fields !== undefined) {
        query.fields = JSON.stringify(params.fields);
    }
    if (params.filter !== undefined) {
        query.filter = JSON.stringify(params.filter);
    }
    if (params.sort !== undefined) {
        query.sort = Array.isArray(params.sort) ? JSON.stringify(params.sort) : String(params.sort);
    }
    if (params.limit !== undefined) {
        query.limit = String(params.limit);
    }
    if (params.offset !== undefined) {
        query.offset = String(params.offset);
    }
    if (params.page !== undefined) {
        query.page = String(params.page);
    }
    if (params.search !== undefined) {
        query.search = String(params.search);
    }
    if (params.deep !== undefined) {
        query.deep = JSON.stringify(params.deep);
    }

    return query;
}

/**
 * Creates a fetcher for `useAsyncData`.
 * Returns a function that performs a `$fetch` request to the specified URL.
 *
 * @template T - Expected data type inside `ICmsResponse`
 * @param url - API endpoint (`/api/cms/...`)
 * @param query - Query parameters
 * @returns An async function returning `ICmsResponse<T>`
 */
function createCmsFetcher<T>(url: string, query: Record<string, string>) {
    return async (): Promise<ICmsResponse<T>> => {
        return await $fetch<ICmsResponse<T>>(url, { query });
    };
}

/**
 * Main composable for fetching Directus data through Nuxt API routes.
 *
 * Provides three methods:
 * - `collection` - list of items from a regular collection     (array)
 * - `singleton`  - singleton collection                        (object)
 * - `item`       - single item from a regular collection by ID (object)
 *
 * @example
 * const { content, error } = await useCms().collection('articles', {
 *   fields: ['id', 'title', { author: ['name'] }],
 *   filter: { status: { _eq: 'published' } },
 *   limit: 10,
 * });
 */
export function useCms() {
    return {
        collection: useCmsCollection,
        singleton: useCmsSingleton,
        item: useCmsItem,
    };
}

/**
 * Fetches a list of items from a regular collection.
 *
 * @template C - Regular collection name
 * @param collection - Collection name
 * @param params - Request parameters (`IUseCmsParams`)
 * @param requestOpts - `useAsyncData` options (lazy, server, immediate, watch…)
 * @returns An object containing `content`, `error`, `status`, and `refresh`
 *
 * @example
 * const { content, error } = await useCms().collection('articles', {
 *   fields: ['id', 'title', { author: ['name'] }],
 *   filter: { status: { _eq: 'published' } },
 *   limit: 10,
 * });
 */
async function useCmsCollection<C extends RegularCollectionType>(
    collection: C,
    params: IUseCmsParams<C> = {},
    requestOpts: AsyncDataOptions<ICmsResponse<Schema[C]>> = {}
): Promise<IUseCmsResponse<Schema[C]>> {
    const query = buildQuery<C>(params);
    const key = `cms:collection:${collection}:${JSON.stringify(query)}`;

    const { data, status, error, refresh } = await useAsyncData(
        key,
        createCmsFetcher<Schema[C]>(`/api/cms/${collection}`, query),
        requestOpts
    );

    return {
        content: computed(() => {
            if (!data.value || data.value.success === false) return null;
            return data.value.data ?? null;
        }),
        error: computed(() => {
            if (error.value) return error.value.message;
            if (data.value && data.value.success === false) return data.value.message;
            return null;
        }),
        status,
        refresh: async () => await refresh(),
    };
}

/**
 * Fetches a singleton collection.
 *
 * @template C - Singleton collection name
 * @param collection - Collection name
 * @param params - Request parameters (`IUseCmsParams`)
 * @param requestOpts - `useAsyncData` options (lazy, server, immediate, watch…)
 * @returns An object containing `content`, `error`, `status`, and `refresh`
 *
 * @example
 * const { content } = await useCms().singleton('home_page', {
 *   fields: ['*', { hero_image: ['*'] }],
 * });
 */
async function useCmsSingleton<C extends SingletonCollectionType>(
    collection: C,
    params: IUseCmsParams<C> = {},
    requestOpts: AsyncDataOptions<ICmsResponse<Schema[C]>> = {}
): Promise<IUseCmsResponse<Schema[C]>> {
    const query = buildQuery<C>(params);
    const key = `cms:singleton:${collection}:${JSON.stringify(query)}`;

    const { data, status, error, refresh } = await useAsyncData(
        key,
        createCmsFetcher<Schema[C]>(`/api/cms/${collection}`, query),
        requestOpts
    );

    return {
        content: computed(() => {
            if (!data.value || data.value.success === false) return null;
            return data.value.data ?? null;
        }),
        error: computed(() => {
            if (error.value) return error.value.message;
            if (data.value && data.value.success === false) return data.value.message;
            return null;
        }),
        status,
        refresh: async () => await refresh(),
    };
}

/**
 * Fetches a single item from a regular collection by ID.
 *
 * @template C - Regular collection name
 * @param collection - Collection name
 * @param id - Item primary key
 * @param params - Request parameters (`IUseCmsParams`)
 * @param requestOpts - `useAsyncData` options (lazy, server, immediate, watch…)
 * @returns An object containing `content`, `error`, `status`, and `refresh`
 *
 * @example
 * const { content } = await useCms().item('articles', 'uuid-or-id', {
 *   fields: ['*', { cover: ['*'] }],
 * });
 */
async function useCmsItem<C extends RegularCollectionType>(
    collection: C,
    id: string | number,
    params: IUseCmsParams<C> = {},
    requestOpts: AsyncDataOptions<ICmsResponse<UnpackList<Schema[C]>>> = {}
): Promise<IUseCmsResponse<UnpackList<Schema[C]>>> {
    const query = buildQuery<C>(params);
    const key = `cms:item:${collection}:${id}:${JSON.stringify(query)}`;

    const { data, status, error, refresh } = await useAsyncData(
        key,
        createCmsFetcher<UnpackList<Schema[C]>>(`/api/cms/${collection}/${id}`, query),
        requestOpts
    );

    return {
        content: computed(() => {
            if (!data.value || data.value.success === false) return null;
            return data.value.data ?? null;
        }),
        error: computed(() => {
            if (error.value) return error.value.message;
            if (data.value && data.value.success === false) return data.value.message;
            return null;
        }),
        status,
        refresh: async () => await refresh(),
    };
}
