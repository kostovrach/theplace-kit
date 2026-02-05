import {
    createDirectus,
    rest,
    staticToken,
    readItems,
    readItem,
    createItem,
    updateItem,
    deleteItem,
} from '@directus/sdk';

const config = useRuntimeConfig();

const API_URL = config.directus.url;
const TOKEN = config.directus.crudToken;

const directus = createDirectus(API_URL).with(rest()).with(staticToken(TOKEN));

function expandFields(fields?: string[], relations?: string[]) {
    let f: string[] = [];

    if (fields && fields.length) f.push(...fields);
    else f.push('*');

    if (relations && relations.length) {
        for (const r of relations) {
            const rel = r.trim();
            if (!rel) continue;

            if (!f.includes(rel)) f.push(rel);
            f.push(`${rel}.*`);
        }
    }

    return f;
}

function normalize(res: any) {
    if (!res) return null;
    if (typeof res === 'object' && 'data' in res) {
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (d && typeof d === 'object') return d;
        return null;
    }
    if (Array.isArray(res)) return res;
    if (typeof res === 'object') return res;

    return null;
}

export async function getDirectusCollection<T = any>(
    collection: string,
    params: {
        fields?: string[];
        relations?: string[];
        filter?: any;
        sort?: string;
        limit?: number;
    } = {}
): Promise<T> {
    const fields = expandFields(params.fields, params.relations);

    const query: any = { fields };

    if (params.filter) query.filter = params.filter;
    if (params.sort) query.sort = params.sort;
    if (params.limit !== undefined) query.limit = params.limit;

    const res = await directus.request(readItems(collection, query));

    return normalize(res);
}

export async function getDirectusItem<T = any>(
    collection: string,
    id: string | number,
    params: {
        fields?: string[];
        relations?: string[];
    } = {}
): Promise<T | null> {
    const fields = expandFields(params.fields, params.relations);

    const query: any = { fields };

    const res = await directus.request(readItem(collection, id, query));

    return normalize(res);
}

export async function createDirectusItem<T = any>(
    collection: string,
    data: Partial<T>,
    params: {
        fields?: string[];
        relations?: string[];
        checkFilter?: any;
    } = {}
): Promise<T | null> {
    try {
        if (params.checkFilter) {
            const existing = await getDirectusCollection<T>(collection, {
                filter: params.checkFilter,
                limit: 1,
            });
            if (existing && Array.isArray(existing) && existing.length > 0) {
                return null;
            }
        }

        const fields = expandFields(params.fields, params.relations);

        const query: any = { fields };

        const res = await directus.request(createItem(collection, data, query));

        return normalize(res);
    } catch (error) {
        console.error(`Error creating item in ${collection}:`, JSON.stringify(error, null, 2));
        return null;
    }
}

export async function updateDirectusItem<T = any>(
    collection: string,
    id: string | number,
    data: Partial<T>,
    params: {
        fields?: string[];
        relations?: string[];
    } = {}
): Promise<T | null> {
    try {
        const fields = expandFields(params.fields, params.relations);

        const query: any = { fields };

        const res = await directus.request(updateItem(collection, id, data, query));

        return normalize(res);
    } catch {
        // console.error(`Error updating item in ${collection} (id: ${id}):`, error);
        return null;
    }
}

export async function deleteDirectusItem(
    collection: string,
    id: string | number
): Promise<boolean> {
    try {
        await directus.request(deleteItem(collection, id));
        return true;
    } catch (error) {
        console.error(`Error deleting item in ${collection} (id: ${id}):`, error);
        return false;
    }
}
