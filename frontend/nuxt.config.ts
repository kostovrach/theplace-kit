export default defineNuxtConfig({
    compatibilityDate: '2026-08-31',
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

    modules: ['@pinia/nuxt', '@vueuse/nuxt', '@vue-final-modal/nuxt'],

    vite: {
        css: {
            preprocessorOptions: {
                scss: { additionalData: "@use '~/assets/scss/abstracts' as *;" },
            },
        },
        optimizeDeps: {
            include: [
                'vue-final-modal',
                'embla-carousel-auto-height',
                'embla-carousel-auto-scroll',
                'embla-carousel-autoplay',
                'embla-carousel-fade',
                'embla-carousel-vue',
                'embla-carousel-wheel-gestures',
            ],
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
            webhookSecret: process.env.DIRECTUS_WEBHOOK_SECRET || '',
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

    imports: {
        dirs: ['~/types/**'],
    },

    build: {
        transpile: ['@fancyapps/ui', 'fancyapps-ui'],
    },
    alias: {
        'fancyapps-ui': './@fancyapps/ui/dist/index.esm.js',
    },
});
