<template>
    <NuxtPage />
    <ModalsContainer />
    <TheCookieNotify />
</template>

<script setup lang="ts">
    import { ModalsContainer } from 'vue-final-modal';
    
    // SEO & Meta ==================================================
    useHead({
        title: 'Название проекта',
        htmlAttrs: {
            lang: 'ru',
        },
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        meta: [
            { name: 'theme-color', content: '#FFFFFF' },
            { property: 'og:type', content: 'website' },
        ],
    });
    // =============================================================
</script>

<style lang="scss">
    @use '~/assets/scss/abstracts' as *;

    html,
    body {
        color: $c-000000;
    }
</style>
