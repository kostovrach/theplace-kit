<template>
    <div class="fallback-page">
        <TheHeader />
        <main class="fallback-page__content">
            <slot></slot>
        </main>
        <TheFooter />
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
    .fallback-page {
        min-height: 100lvh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow-x: clip;
    }
</style>
