<template>
    <component
        :is="props.is"
        :style="{ flex: `0 0 ${props.width}` }"
        class="carousel-slide"
        v-bind="{ ...$attrs }"
    >
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            /** Component tag */
            is?: keyof HTMLElementTagNameMap;
            width?: string;
        }>(),
        {
            is: 'div',
            width: '100%',
        }
    );
</script>

<style scoped lang="scss">
    .carousel-slide {
        box-sizing: border-box;
        min-width: 0;
    }
</style>
