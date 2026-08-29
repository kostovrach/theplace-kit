export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    ssr: true,

    typescript: {
        strict: true,
        typeCheck: 'build',
        tsConfig: {
            include: ['../scripts/**/*.ts'],
        },
    },

    experimental: {
        payloadExtraction: true,
    },

    nitro: {
        preset: 'node-server',
    },

    modules: [
        '@pinia/nuxt',
        'nuxt-svg-sprite-icon',
        '@vueuse/nuxt',
        '@primevue/nuxt-module',
        '@vue-final-modal/nuxt',
        'vue-yandex-maps/nuxt',
    ],

    vite: {
        optimizeDeps: {
            include: ['vue-final-modal'],
        },
    },

    runtimeConfig: {
        public: {
            cmsUrl: process.env.DIRECTUS_URL || '',
            siteUrl: process.env.SITE_URL || '',

            /** dev / prod */
            appEnv: process.env.APP_ENV || 'dev',
        },
        logger: {
            /**
             * - `DEBUG`: полное логирование
             * - `ERROR`: только ошибки
             * - `PROD`: предупреждения и ошибки
             */
            level: process.env.LOG_LEVEL || 'DEBUG',
        },
        directus: {
            url: process.env.DIRECTUS_URL || '',
            token: process.env.DIRECTUS_TOKEN || '',
            webhookSecret: process.env.DIRECTUS_WEBHOOK_SECRET || ''
        },
        smtp: {
            host: process.env.SMTP_HOST || '',
            port: process.env.SMTP_PORT || '465',
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
            target: process.env.SMTP_ORDERS_TARGET || '',
        },
    },

    css: ['vue-final-modal/style.css', '~/assets/css/main.css'],

    svgSprite: {
        input: './app/assets/svg',
        output: './app/assets/svg/gen',
        defaultSprite: 'icons',
        elementClass: 'icon',
        optimize: false,
    },

    yandexMaps: {
        apikey: process.env.YANDEX_API_KEY || '',
        strictMode: true,
        lang: 'ru_RU',
        version: 'v3',
        typesInjection: false,
    },

    build: {
        transpile: ['@fancyapps/ui', 'fancyapps-ui'],
    },
    alias: {
        'fancyapps-ui': './@fancyapps/ui/dist/index.esm.js',
    },
});
