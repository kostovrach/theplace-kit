import type { AsyncDataOptions, AsyncDataRequestStatus } from '#app';
import type { Query, UnpackList } from '@directus/sdk';

/**
 * Алиас стандартного query-типа Directus SDK
 * с привязкой к конкретной коллекции схемы.
 * @template C - Имя коллекции из `Schema`
 *
 * @internal
 */
type LocalQuery<C extends CollectionNameType> = Query<Schema, UnpackList<Schema[C]>>;

/**
 * Параметры запроса к серверному proxy Directus.
 * Повторяют основные поля `Query` из Directus SDK с привязкой к коллекции.
 * @template C - Имя коллекции из `Schema`
 *
 * @internal
 */
interface UseCmsParams<C extends CollectionNameType> {
    /**
     * Список полей в формате Directus SDK (объектный или строковый синтаксис).
     *
     * **Имеет наивысший приоритет: если передан, параметр {@link relations} игнорируется.**
     * @example
     * ['*', { cover: ['*'], author: ['id', 'name'] }]
     */
    fields?: LocalQuery<C>['fields'];

    /**
     * Синтаксический сахар для вложенных связей.
     *
     * Принимает массив строк в точечной нотации.
     * Парсится в `fields: ['*', ...relations]`.
     *
     * Поддерживает несколько полей через запятую в одном элементе:
     * `'blocks.item.file.id,title'` => `['blocks.item.file.id', 'blocks.item.file.title']`.
     *
     * **Игнорируется, если одновременно передан {@link fields}**.
     *
     * @example
     * ['cover.*', 'blocks.*', 'blocks.item.*', 'blocks.item.image.*']
     * @example
     * ['author.id,name', 'cover.*']
     */
    relations?: string[];

    /**
     * Фильтр записей (синтаксис `Directus Filter`).
     * @example
     * { status: { _eq: 'published' } }
     */
    filter?: LocalQuery<C>['filter'];

    /**
     * Сортировка.
     * Префикс `-` означает сортировку по убыванию.
     * @example
     * ['-date_created', 'title']
     */
    sort?: LocalQuery<C>['sort'];

    /**
     * Ограничение количества возвращаемых элементов.
     * - `-1`: без ограничения (поведение Directus).
     */
    limit?: number;

    /**
     * Смещение от начала выборки (пагинация).
     */
    offset?: number;

    /**
     * Номер страницы (альтернатива `offset`).
     * - Формула рассчета: `offset = (page - 1) * limit`
     */
    page?: number;

    /**
     * Текстовый поиск по searchable-полям коллекции.
     */
    search?: string;

    /**
     * Параметры для фильтрации / сортировки / лимита на уровне вложенных связей.
     */
    deep?: LocalQuery<C>['deep'];
}

/**
 * Унифицированный результат работы composable.
 * @template T - Тип данных, которые ожидаются в `content`
 *
 * @internal
 */
interface UseCmsResponse<T> {
    /**
     * Реактивные данные коллекции / элемента / singleton. `null` в случае, если:
     * - запрос еще не завершен;
     * - запрос завершен с ошибкой;
     * - API вернуло `success: false`.
     */
    content: Ref<T | null>;

    /**
     * Текст ошибки, при наличии, или `null`.
     */
    error: Ref<string | null>;

    /**
     * Текущий статус запроса (`idle` | `pending` | `success` | `error`).
     */
    status: Ref<AsyncDataRequestStatus>;

    /**
     * Принудительно повторно выполнить запрос.
     */
    refresh: () => Promise<void>;
}

/**
 * Разворачивает строки `relations` в плоский список field-путей.
 *
 * - Поддерживает точечную нотацию: `blocks.item.image.*`
 * - Поддерживает несколько полей через запятую: `file.id,title`
 *   => `['file.id', 'file.title']` (общий префикс сохраняется)
 *
 * @param relations - Массив строк связей
 * @returns Плоский массив field-путей
 *
 * @internal
 */
function parseRelations(relations: string[]): string[] {
    const result: string[] = [];

    for (const raw of relations) {
        const parts = raw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        if (parts.length === 0) continue;

        if (parts.length === 1) {
            result.push(parts[0]!);
            continue;
        }

        const first = parts[0]!;
        const lastDot = first.lastIndexOf('.');

        if (lastDot === -1) {
            result.push(...parts);
        } else {
            const prefix = first.slice(0, lastDot + 1);
            const firstLeaf = first.slice(lastDot + 1);

            result.push(prefix + firstLeaf);
            for (let i = 1; i < parts.length; i++) {
                result.push(prefix + parts[i]);
            }
        }
    }

    return result;
}

/**
 * Преобразование типизированных query-параметров SDK в строку для HTTP-запроса к `/api/cms/...`.
 * @template C - Имя коллекции
 * @param params - Параметры запроса
 * @returns Объект, готовый к передаче в `$fetch` как `query`
 *
 * @internal
 */
function buildQuery<C extends CollectionNameType>(
    params: UseCmsParams<C> = {}
): Record<string, string> {
    const query: Record<string, string> = {};

    if (params.fields !== undefined) {
        query.fields = JSON.stringify(params.fields);
    } else if (params.relations !== undefined && params.relations.length > 0) {
        const parsedRelations = parseRelations(params.relations);
        query.fields = JSON.stringify(['*', ...parsedRelations]);
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
 * Фабрика обработчика для {@link useAsyncData}.
 * Создает функцию, которая выполняет `$fetch` к указанному URL.
 *
 * @template T - Ожидаемый тип данных внутри `CmsResponse`
 * @param url - Endpoint API (`/api/cms/...`)
 * @param query - Query-параметры
 * @returns Async-функция, возвращающая `CmsResponse<T>`
 *
 * @internal
 */
function createCmsFetcher<T>(url: string, query: Record<string, string>) {
    return async (): Promise<CmsResponse<T>> => {
        return await $fetch<CmsResponse<T>>(url, { query });
    };
}

/**
 * Основной composable для чтения данных из Directus через Nuxt API-роуты.
 *
 * Предоставляет три метода:
 * - `getCollection` - список элементов regular-коллекции      (массив)
 * - `getSingleton`  - singleton-коллекция                     (объект)
 * - `getItem`       - один элемент regular-коллекции по ID    (объект)
 *
 * @example
 * // С использованием fields (полный контроль)
 * const { content, error } = await useCms().getCollection('articles', {
 *   fields: ['id', 'title', { author: ['name'] }],
 *   filter: { status: { _eq: 'published' } },
 *   limit: 10,
 * });
 *
 * @example
 * // С использванием relations (сахар)
 * const { content } = await useCms().getCollection('articles', {
 *   relations: ['cover.*', 'blocks.*', 'blocks.item.*', 'blocks.item.image.*'],
 *   filter: { published: { _eq: true } },
 * });
 */
export function useCms() {
    return {
        getCollection: useCmsCollection,
        getSingleton: useCmsSingleton,
        getItem: useCmsItem,
    };
}

/**
 * Получение списка элементов regular-коллекции.
 *
 * @template C - Имя regular-коллекции
 * @param collection - Название коллекции
 * @param params - Параметры запроса ({@link UseCmsParams})
 * @param requestOpts - Опции {@link useAsyncData} (lazy, server, immediate, watch…)
 * @returns Объект с `content`, `error`, `status` и `refresh`
 *
 * @example
 * const { content, error } = await useCms().getCollection('articles', {
 *   fields: ['id', 'title', { author: ['name'] }],
 *   filter: { status: { _eq: 'published' } },
 *   limit: 10,
 * });
 */
async function useCmsCollection<C extends RegularCollectionType>(
    collection: C,
    params: UseCmsParams<C> = {},
    requestOpts: AsyncDataOptions<CmsResponse<Schema[C]>> = {}
): Promise<UseCmsResponse<Schema[C]>> {
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
 * Получение singleton-коллекции.
 *
 * @template C - Имя singleton-коллекции
 * @param collection - Название коллекции
 * @param params - Параметры запроса ({@link UseCmsParams})
 * @param requestOpts - Опции {@link useAsyncData} (lazy, server, immediate, watch…)
 * @returns Объект с `content`, `error`, `status` и `refresh`
 *
 * @example
 * const { content } = await useCms().getSingleton('home_page', {
 *   fields: ['*', { hero_image: ['*'] }],
 * });
 */
async function useCmsSingleton<C extends SingletonCollectionType>(
    collection: C,
    params: UseCmsParams<C> = {},
    requestOpts: AsyncDataOptions<CmsResponse<Schema[C]>> = {}
): Promise<UseCmsResponse<Schema[C]>> {
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
 * Получение одного элемента regular-коллекции по ID.
 *
 * @template C - Имя regular-коллекции
 * @param collection - Название коллекции
 * @param id - Primary key элемента
 * @param params - Параметры запроса ({@link UseCmsParams})
 * @param requestOpts - Опции {@link useAsyncData} (lazy, server, immediate, watch…)
 * @returns Объект с `content`, `error`, `status` и `refresh`
 *
 * @example
 * const { content } = await useCms().getItem('articles', 'uuid-or-id', {
 *   fields: ['*', { cover: ['*'] }],
 * });
 */
async function useCmsItem<C extends RegularCollectionType>(
    collection: C,
    id: string | number,
    params: UseCmsParams<C> = {},
    requestOpts: AsyncDataOptions<CmsResponse<UnpackList<Schema[C]>>> = {}
): Promise<UseCmsResponse<UnpackList<Schema[C]>>> {
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
