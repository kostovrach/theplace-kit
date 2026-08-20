<template>
    <div class="home">
        Главная страница
    </div>
</template>

<script setup lang="ts">
    interface IPage {
        id: string | number;
        date_created: string;
        date_updated: string | null;
    }
</script>
