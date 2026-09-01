<template>
    <NuxtLoadingIndicator
        color="var(--loading-bar-color)"
        :height="4"
        :throttle="200"
        :duration="2000"
    />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <ModalsContainer />
</template>

<script setup lang="ts">
    import { ModalsContainer } from 'vue-final-modal';

    useHead({
        title: 'ThePlace-kit',
        htmlAttrs: {
            lang: 'ru',
        },
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }],
        meta: [
            { name: 'theme-color', content: '#FFFFFF' },
            { property: 'og:type', content: 'website' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
        ],
    });
</script>

<style lang="scss">
    :root {
        --loading-bar-color: #{$c-accent};
    }

    html,
    body {
        color: $c-000000;
    }

    ::selection {
        background-color: rgba($c-accent, 0.5);
    }
</style>
