import { createDirectus, rest, staticToken } from '@directus/sdk';

const config = useRuntimeConfig();

const URL = config.directus.url;
const TOKEN = config.directus.token;

export const directus = createDirectus<Schema>(URL).with(rest()).with(staticToken(TOKEN));
