export default eventHandler(async (event) => {
    const API_URL = useRuntimeConfig().directus.url;
    const { id } = getRouterParams(event);

    const asset = await fetch(`${API_URL}/assets/${id}`);

    return asset.body;
});
