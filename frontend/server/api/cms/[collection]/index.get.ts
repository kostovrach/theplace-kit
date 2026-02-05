import { fetchCollection } from '~~/server/services/directus/data';

export default defineCachedEventHandler(
    async (event) => {
        const config = useRuntimeConfig();

        try {
            let q: Record<string, string> = {};
            const url = event.node.req.url;
            if (url) {
                const parsed = new URL(url, config.public.siteUrl);
                q = Object.fromEntries(parsed.searchParams.entries());
            }

            const { collection } = getRouterParams(event);
            if (!collection) {
                event.node.res.statusCode = 400;
                return { data: null, error: 'collection is required' };
            }

            let fields: string[] | undefined;
            if (q.fields) {
                try {
                    const raw = String(q.fields);
                    if (raw.trim().startsWith('[')) fields = JSON.parse(raw);
                    else
                        fields = raw
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                } catch {}
            }

            let relations: string[] | undefined;
            if (q.relations)
                relations = String(q.relations)
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);

            let filter: any | undefined;
            if (q.filter) {
                try {
                    filter = typeof q.filter === 'string' ? JSON.parse(q.filter) : q.filter;
                } catch {
                    event.node.res.statusCode = 400;
                    return { data: null, error: 'invalid filter JSON' };
                }
            }

            const sort = q.sort ? String(q.sort) : undefined;
            const limit = q.limit !== undefined ? Number(q.limit) : undefined;
            const resolveFiles =
                q.resolveFiles !== undefined ? String(q.resolveFiles) !== 'false' : true;
            const force = q.force === '1' || q.force === 'true';

            const opts = { resolveFiles, force, memoryTtl: undefined as number | undefined };
            const params = { fields: fields ?? ['*', ...(relations ?? [])], filter, sort, limit };

            const data = await fetchCollection(collection, params, opts);

            return { data };
        } catch (err: any) {
            console.error('[api/cms] error', err);
            event.node.res.statusCode = 500;
            return { data: null, error: String(err?.message || err) };
        }
    },
    { maxAge: 300 }
);
