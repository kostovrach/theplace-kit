<template>
    <NuxtPage />
    <ModalsContainer />
</template>

<script setup lang="ts">
    import { ModalsContainer } from 'vue-final-modal';
</script>

<style lang="scss">
    @use '~/assets/scss/abstracts' as *;

    html,
    body {
        color: $c-000000;
    }
</style>
