import { createDirectus, rest, staticToken } from '@directus/sdk';

const config = useRuntimeConfig();

const API_URL = config.directus.url;
const TOKEN = config.directus.readToken;

export const directus = createDirectus(API_URL).with(rest()).with(staticToken(TOKEN));
