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
    <TheCookieNotify />
</template>

<script setup lang="ts">
    import { ModalsContainer, useVfm } from 'vue-final-modal';

    const router = useRouter();

    /** закрытие всех модальных окон при клиентской навигации */
    router.beforeEach((to, from) => {
        if (to.name !== from.name) {
            const { closeAll } = useVfm();
            closeAll();
        }
    });

    // SEO & Meta ==================================================
    useHead({
        title: '<название_проекта>',
        htmlAttrs: {
            lang: 'ru',
        },
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        meta: [
            { name: 'theme-color', content: '#FFFFFF' },
            { property: 'og:type', content: 'website' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
        ],
    });
    // =============================================================
</script>

<style lang="scss">
    @use '~/assets/scss/abstracts' as *;

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
