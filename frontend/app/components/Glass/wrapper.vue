<template>
    <component :is="props.component" class="liquid-glass">
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            component?: string;
        }>(),
        {
            component: 'div',
        }
    );
</script>

<style lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .liquid-glass {
        $filter: url(#liquid-glass-distortion) blur(3px) saturate(150%) contrast(120%);

        position: relative;
        background-color: rgba($c-FFFFFF, 0.15);

        @supports (backdrop-filter: $filter) {
            backdrop-filter: $filter;
        }
        @supports not (backdrop-filter: $filter) {
            background-color: rgba($c-FFFFFF, 0.9);
        }

        box-shadow:
            inset 0 rem(1) 0 rgba($c-main, 0.25),
            0 rem(8) rem(16) rgba($c-secondary, 0.05);
        border: rem(1) solid rgba($c-FFFFFF, 0.18);
    }
</style>
