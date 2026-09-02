<template>
    <a
        v-bind="{ ...$attrs }"
        :data-lightbox="props.hashKey"
        :href="props.source"
        target="_self"
        :class="['lightbox-trigger', props.class]"
    >
        <slot></slot>
    </a>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            /** Источник контента для открытия в lightbox */
            source: string;

            /** Ключ для хэш-навигации */
            hashKey?: string;

            /** Additional CSS class */
            class?: string | Record<string, unknown> | string[];
        }>(),
        { hashKey: '' }
    );
</script>
