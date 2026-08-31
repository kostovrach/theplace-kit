<template>
    <section class="not-found">
        <div class="not-found__container">Ошибка 404</div>
    </section>
</template>

<script setup lang="ts">
    definePageMeta({ layout: 'fallback' });
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .not-found {
        &__container {
        }
    }
</style>
