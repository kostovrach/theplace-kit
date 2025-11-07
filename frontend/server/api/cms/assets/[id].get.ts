import type { H3Event } from 'h3';

export default eventHandler(async (event: H3Event) => {
    const API_URL = useRuntimeConfig().directus.url;
    const { id } = getRouterParams(event);

    const asset = await fetch(`${API_URL}/assets/${id}`);

    return asset.body;
});
