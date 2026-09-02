<template>
    <a
        v-bind="{ ...$attrs }"
        data-lightbox
        :href="props.source"
        target="_self"
        :class="['lightbox-trigger', props.class]"
    >
        <slot></slot>
    </a>
</template>

<script setup lang="ts">
    const props = defineProps<{
        /** Источник контента для открытия в lightbox */
        source: string;

        /** Additional CSS class */
        class?: string | Record<string, unknown> | string[];
    }>();
</script>
