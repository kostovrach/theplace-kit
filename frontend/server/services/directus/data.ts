import { directus, assetUrl } from './core';
import { readItems, readItem } from '@directus/sdk';

const FILE_NAMES = new Set<string>([
    'video',
    'poster',
    'logo',
    'file',
    'media',
    'favicon',
    'files',
    'avatar',
    'cover',
    'thumbnail',
    'attachment',
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function addFileUrls(obj: any): void {
    if (!obj) return;
    const walk = (node: any) => {
        if (!node) return;
        if (Array.isArray(node)) return node.forEach(walk);
        if (typeof node !== 'object') return;
        for (const [k, v] of Object.entries(node)) {
            if (
                typeof v === 'string' &&
                UUID_RE.test(v) &&
                (FILE_NAMES.has(k) || k.includes('image'))
            ) {
                if (!node[`${k}_url`]) node[`${k}_url`] = assetUrl(v);
            } else if (v && typeof v === 'object') {
                walk(v);
            }
        }
    };
    walk(obj);
}

/* ---------- normalizer: single entry point ---------- */
/**
 * Возвращает:
 * - массив (если Directus вернул массив или { data: [...] })
 * - объект (если Directus вернул объект или { data: { ... } })
 * - null/[] при отсутствии
 */
export function normalizeCollectionResponse(res: any): any | any[] | null {
    if (res == null) return null;

    // Если Directus вернул "сырой" массив
    if (Array.isArray(res)) return res;

    // Если у нас объект с data
    if (res && typeof res === 'object' && 'data' in res) {
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (d && typeof d === 'object') return d;
        return null;
    }

    // Если Directus вернул одиночный объект (singleton)
    if (res && typeof res === 'object') return res;

    return null;
}

/* ---------- memory cache (server) ---------- */
type MemRec = { data: any; ts: number };
const memoryCache = new Map<string, MemRec>();

export function memGet(key: string, ttl?: number) {
    const rec = memoryCache.get(key);
    if (!rec) return null;
    if (ttl && Date.now() - rec.ts > ttl) {
        memoryCache.delete(key);
        return null;
    }
    return rec.data;
}
export function memSet(key: string, data: any) {
    memoryCache.set(key, { data, ts: Date.now() });
}
export function clearMemoryCache(prefix?: string) {
    if (!prefix) {
        memoryCache.clear();
        return;
    }
    for (const k of Array.from(memoryCache.keys())) if (k.startsWith(prefix)) memoryCache.delete(k);
}

/* ---------- helpers ---------- */
function buildListKey(collection: string, params: Record<string, any> = {}) {
    return `list:${collection}:${JSON.stringify(params || {})}`;
}
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
 * Возвращает либо массив (коллекция), либо объект (singleton), либо null.
 */
export async function fetchCollection(
    collection: string,
    params: { fields?: any; filter?: any; sort?: any; limit?: any } = {},
    opts: { force?: boolean; memoryTtl?: number; resolveFiles?: boolean } = {}
): Promise<any> {
    const fields = params.fields ?? ['*'];
    const key = buildListKey(collection, {
        fields,
        filter: params.filter,
        sort: params.sort,
        limit: params.limit,
    });

    // cache TTL
    const ttl = opts.memoryTtl ?? 60_000 * 5;

    if (!opts.force) {
        const cached = memGet(key, ttl);
        if (cached !== null) return cached;
    }

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
            if (opts.resolveFiles !== false) normalized.forEach(addFileUrls);
            memSet(key, normalized);
            return normalized;
        }

        if (normalized && typeof normalized === 'object') {
            if (opts.resolveFiles !== false) addFileUrls(normalized);
            memSet(key, normalized);
            return normalized;
        }

        memSet(key, null);
        return null;
    } catch (err) {
        console.error('[directusData] fetchCollection error', err);
        throw err;
    }
}

/**
 * Возвращает объект или null
 */
export async function fetchItem(
    collection: string,
    id: string,
    params: { fields?: any } = {},
    opts: { force?: boolean; memoryTtl?: number; resolveFiles?: boolean } = {}
): Promise<any> {
    const fields = params.fields ?? ['*'];

    const key = `item:${collection}:${id}:${JSON.stringify({ fields })}`;

    const ttl = opts.memoryTtl ?? 60_000 * 5;

    if (!opts.force) {
        const cached = memGet(key, ttl);
        if (cached !== null) return cached;
    }

    try {
        const query: Record<string, any> = {};
        if (fields) query.fields = fields;

        const res = await directus.request(readItem(collection, id, query));

        if (!res) {
            memSet(key, null);
            return null;
        }

        if (opts.resolveFiles !== false) {
            addFileUrls(res);
        }

        memSet(key, res);
        return res;
    } catch (err) {
        console.error('[directusData] fetchItem error', err);
        throw err;
    }
}
