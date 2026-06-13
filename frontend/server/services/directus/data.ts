import { directus } from '~~/server/services/directus/core';
import { readItems, readItem } from '@directus/sdk';

/* ---------- normalizer: single entry point ---------- */
/**
 * @returns
 * - массив (если Directus вернул массив или `{ data: [...] }`)
 * - объект (если Directus вернул объект или `{ data: { ... } }`)
 * - `null`/`[]` при отсутствии
 */
export function normalizeCollectionResponse(res: any): any | any[] | null {
    if (res == null) return null;

    // Если Directus вернул "сырой" массив
    if (Array.isArray(res)) return res;

    // Если объект с data
    if (res && typeof res === 'object' && 'data' in res) {
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (d && typeof d === 'object') return d;
        return null;
    }

    // Если Directus вернул singleton
    if (res && typeof res === 'object') return res;

    return null;
}

/* ---------- helpers ---------- */
function buildParams({
    fields,
    filter,
    sort,
    limit,
}: {
    fields?: any;
    filter?: any;
    sort?: any;
    limit?: any;
}) {
    const params: Record<string, any> = {};
    if (fields) params.fields = fields;
    if (filter) params.filter = filter;
    if (sort) params.sort = sort;
    if (limit !== undefined) params.limit = limit;
    return params;
}

/* ---------- fetchCollection ---------- */
/**
 * @returns массив (коллекция) / singleton / `null`
 */
export async function fetchCollection(
    collection: string,
    params: { fields?: any; filter?: any; sort?: any; limit?: any } = {}
): Promise<any> {
    const fields = params.fields ?? ['*'];

    try {
        const query = buildParams({
            fields,
            filter: params.filter,
            sort: params.sort,
            limit: params.limit,
        });

        const res = await directus.request(readItems(collection, query));
        const normalized = normalizeCollectionResponse(res);

        if (Array.isArray(normalized)) {
            return normalized;
        }

        if (normalized && typeof normalized === 'object') {
            return normalized;
        }

        return null;
    } catch (err) {
        console.error('[directusData] fetchCollection error', err);
        throw err;
    }
}

/**
 * @returns объект или `null`
 */
export async function fetchItem(
    collection: string,
    id: string,
    params: { fields?: any } = {}
): Promise<any> {
    const fields = params.fields ?? ['*'];

    try {
        const query: Record<string, any> = {};
        if (fields) query.fields = fields;

        const res = await directus.request(readItem(collection, id, query));
        if (!res) return null;

        return res;
    } catch (err) {
        console.error('[directusData] fetchItem error', err);
        throw err;
    }
}
