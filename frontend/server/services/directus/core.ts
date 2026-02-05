import { createDirectus, rest, staticToken } from '@directus/sdk';

const config = useRuntimeConfig();

const API_URL = config.directus.url;
const TOKEN = config.directus.token;


export const directus = createDirectus(API_URL).with(rest()).with(staticToken(TOKEN));

export function assetUrl(id: string, params: Record<string, any> = {}) {
    if (!id) return null;
    const qs = new URLSearchParams(params).toString();
    return `/api/cms/assets/${id}${qs ? `?${qs}` : ''}`;
}
