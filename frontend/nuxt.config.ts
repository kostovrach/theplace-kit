export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    ssr: true,

    typescript: {
        strict: true,
        typeCheck: true,
    },

    app: {
        head: {
            title: 'Nuxt-kit',
            htmlAttrs: {
                lang: 'ru',
            },
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
            meta: [
                { name: 'robots', content: 'index, follow' },
                { property: 'og:type', content: 'website' },
            ],
        },
    },

    // -------------------Настройки Nitro--------------------------
    // nitro: {
    //     preset: 'vercel',
    // },
    // ------------------------------------------------------------

    runtimeConfig: {
        public: {
            apiBase: process.env.DIRECTUS_URL || 'http://localhost:8055',
            urlBase: process.env.BASE_URL || 'http://localhost:3000',
        },
        directus: {
            url: process.env.DIRECTUS_URL || 'http://localhost:8055',
            token: process.env.DIRECTUS_TOKEN || '',
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

    // -------------------------svg-sprite--------------------------
    svgSprite: {
        input: './app/assets/svg',
        output: './app/assets/svg/gen',
        defaultSprite: 'icons',
        elementClass: 'icon',
        optimize: false,
    },
    // ------------------------------------------------------------

    // -------------------vue-yandex-maps--------------------------
    yandexMaps: {
        apikey: process.env.YANDEX_API_KEY || 'empty',
        servicesApikeys: {
            suggest: process.env.YANDEX_SUGGEST_KEY || 'empty',
        },
        strictMode: true,
        lang: 'ru_RU',
        version: 'v3',
    },
    // ------------------------------------------------------------

    // ------------------------Алиасы и тд.------------------------
    build: {
        transpile: ['@fancyapps/ui', 'fancyapps-ui'],
    },
    alias: {
        'fancyapps-ui': './@fancyapps/ui/dist/index.esm.js',
    },
    // ------------------------------------------------------------
});
