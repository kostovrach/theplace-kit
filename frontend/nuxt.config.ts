export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    ssr: true,

    typescript: {
        strict: true,
        typeCheck: true,
    },

    nitro: {
        preset: 'node-server',
    },

    runtimeConfig: {
        public: {
            cmsUrl: process.env.DIRECTUS_URL || '',
            siteUrl: process.env.SITE_URL || '',
            appEnv: (process.env.APP_ENV || 'prod') as 'dev' | 'prod',
        },
        directus: {
            url: process.env.DIRECTUS_URL || '',
            readToken: process.env.DIRECTUS_READ_TOKEN || '',
            crudToken: process.env.DIRECTUS_CRUD_TOKEN || '',
        },
        smtp: {
            host: process.env.SMTP_HOST || '',
            port: process.env.SMTP_PORT || '465',
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
            ordersTarget: process.env.SMTP_ORDERS_TARGET || '',
        },
    },

    modules: [
        '@pinia/nuxt',
        '@nuxt/eslint',
        'nuxt-svg-sprite-icon',
        '@vueuse/nuxt',
        '@primevue/nuxt-module',
        '@vue-final-modal/nuxt',
        'vue-yandex-maps/nuxt',
    ],

    css: ['vue-final-modal/style.css', '~/assets/css/main.css'],

    svgSprite: {
        input: './app/assets/svg',
        output: './app/assets/svg/gen',
        defaultSprite: 'icons',
        elementClass: 'icon',
        optimize: false,
    },

    yandexMaps: {
        apikey: process.env.YANDEX_API_KEY || 'empty',
        strictMode: true,
        lang: 'ru_RU',
        version: 'v3',
    },

    build: {
        transpile: ['@fancyapps/ui', 'fancyapps-ui'],
    },
    alias: {
        'fancyapps-ui': './@fancyapps/ui/dist/index.esm.js',
    },
});
