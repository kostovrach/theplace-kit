<template>
    <div class="error">
        <p class="error__title">Не удалось загрузить</p>
        <button class="error__button" @click="refreshPage">
            <span>Попробовать снова ↺</span>
        </button>
    </div>
</template>

<script setup lang="ts">
    function refreshPage() {
        refreshNuxtData();
    }
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .error {
        $p: &;
    }
</style>
