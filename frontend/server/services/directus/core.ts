import { directus } from '~~/server/services/directus/client';

import { readItems, readItem, createItem, updateItem, deleteItem } from '@directus/sdk';
import type { Query, UnpackList, NestedPartial } from '@directus/sdk';

const LOG_PREFIX = '[Directus]:';

export interface IDirectusQuery<C extends CollectionNameType> {
    fields?: Query<Schema, Schema[C] & object>['fields'];
    filter?: Query<Schema, Schema[C] & object>['filter'];
    where?: Record<string, unknown>;
    sort?: Query<Schema, Schema[C] & object>['sort'];
    limit?: number;
}

/** Сборка и нормализация query-параметров */
function buildParams<C extends CollectionNameType>({
    fields,
    filter,
    sort,
    limit,
}: IDirectusQuery<C>): Query<Schema, Schema[C] & object> {
    return {
        ...(fields && { fields }),
        ...(filter && { filter }),
        ...(sort && { sort }),
        ...(limit !== undefined && { limit }),
    };
}

/**
 * Запрос коллекции с выводом типов элементов базы данных
 * @returns `массив` / `singleton` / `null`
 */
export async function getDirectusCollection<C extends CollectionNameType>(
    collection: C,
    params: IDirectusQuery<C> = {}
): Promise<Schema[C] | null> {
    const fields = params.fields ?? ['*'];

    try {
        const query = buildParams<C>({
            fields,
            filter: params.filter,
            sort: params.sort,
            limit: params.limit,
        });

        // @ts-expect-error
        const res = await directus.request<Schema[C]>(readItems(collection, query));

        return res ?? null;
    } catch (err) {
        console.error(LOG_PREFIX, `Error fetch collection "${collection}":`, err);
        throw err;
    }
}

/**
 * Запрос элемента коллекции по ID с выводом типов элементов базы данных
 * @returns объект или `null`
 */
export async function getDirectusItem<C extends CollectionNameType>(
    collection: C,
    id: string | number,
    params: IDirectusQuery<C> = {}
): Promise<Schema[C] | null> {
    const fields = params.fields ?? ['*'];

    try {
        const query = buildParams<C>({
            fields,
            filter: params.filter,
            sort: params.sort,
            limit: params.limit,
        });

        // @ts-expect-error
        const res = await directus.request<Schema[C]>(readItem(collection, id, query));

        return res ?? null;
    } catch (err) {
        console.error(
            LOG_PREFIX,
            `Error fetch item with ID ${id} from collection "${collection}":`,
            err
        );
        throw err;
    }
}

/** Создание эелемента в коллекции */
export async function createDirectusItem<C extends CollectionNameType>(
    collection: C,
    data: NestedPartial<UnpackList<Schema[C]>>,
    params: {
        fields?: Query<Schema, Schema[C]>['fields'];
        checkFilter?: Query<Schema, Schema[C]>['filter'];
    } = {}
): Promise<Schema[C] | null> {
    try {
        /** Проверка на дубликаты перед созданием */
        if (params.checkFilter) {
            const existing = await getDirectusCollection(collection, {
                filter: params.checkFilter,
                limit: 1,
            });
            if ((Array.isArray(existing) && existing.length > 0) || existing) {
                return null;
            }
        }

        const query = buildParams<C>({ fields: params.fields ?? ['*'] });

        const res = await directus.request<Schema[C]>(createItem(collection, data, query));

        return res ?? null;
    } catch (err) {
        console.error(LOG_PREFIX, `Error creating an item from collection "${collection}":`, err);
        return null;
    }
}

/** Обновление существующего элемента по ID */
export async function updateDirectusItem<C extends CollectionNameType>(
    collection: C,
    id: string | number,
    data: NestedPartial<Schema[C]>,
    params: { fields?: Query<Schema, Schema[C]>['fields'] } = {}
): Promise<Schema[C] | null> {
    try {
        const query = buildParams<C>({ fields: params.fields ?? ['*'] });

        const res = await directus.request<Schema[C]>(updateItem(collection, id, data, query));
        return res ?? null;
    } catch (err) {
        console.error(
            LOG_PREFIX,
            `Error updating item with ID ${id} from collection "${collection}":`,
            err
        );
        return null;
    }
}

/** Удаление элемента коллекции по ID */
export async function deleteDirectusItem<C extends CollectionNameType>(
    collection: C,
    id: string | number
): Promise<boolean> {
    try {
        await directus.request(deleteItem(collection, id));
        return true;
    } catch (err) {
        console.error(
            LOG_PREFIX,
            `Error deleting item with ID ${id} from collection "${collection}":`,
            err
        );
        return false;
    }
}
