import { fetchItem } from '~~/server/services/directus/data';

export default defineCachedEventHandler(
    async (event) => {
        const config = useRuntimeConfig();

        try {
            const { collection, id } = getRouterParams(event);
            if (!collection || !id) {
                event.node.res.statusCode = 400;
                return { data: null, error: 'collection and id are required' };
            }

            // parse query
            let q: Record<string, string> = {};
            const url = event.node.req.url;
            if (url) {
                const parsed = new URL(url, config.public.siteUrl);
                q = Object.fromEntries(parsed.searchParams.entries());
            }

            // fields
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

            // relations
            let relations: string[] | undefined;
            if (q.relations) {
                relations = String(q.relations)
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
            }

            // options
            const resolveFiles =
                q.resolveFiles !== undefined ? String(q.resolveFiles) !== 'false' : true;
            const force = q.force === '1' || q.force === 'true';

            const data = await fetchItem(
                collection,
                id,
                {
                    fields: fields ?? ['*', ...(relations ?? [])],
                },
                { resolveFiles, force }
            );

            return { data };
        } catch (err: any) {
            console.error('[api/cms/item] error', err);
            event.node.res.statusCode = 500;
            return { data: null, error: String(err?.message || err) };
        }
    },
    {
        maxAge: 300,
    }
);
