<template>
    <component
        v-bind="{ ...$attrs }"
        :is="props.is"
        :style="{ flex: `0 0 ${props.width}` }"
        :class="[props.class, 'carousel-slide']"
    >
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            /**
             * Component HTML tag
             *
             * @default 'div'
             */
            is?: keyof HTMLElementTagNameMap;

            /**
             * Additional CSS class
             */
            class?: string | Record<string, unknown> | string[];

            /**
             * Размер слайда по умолчанию
             *
             * @default '100%'
             */
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
