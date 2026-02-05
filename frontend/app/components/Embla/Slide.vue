<template>
    <div class="embla__slide" :style="{ flex: `0 0 ${props.width}` }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    interface Props {
        width?: string;
        padding?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        width: 'fit-content',
        padding: '0',
    });
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .embla__slide {
        box-sizing: border-box;
        min-width: 0;
    }
</style>
