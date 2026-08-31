<template>
    <a data-lightbox :href="props.source" target="_self" class="lightbox-trigger" v-bind="{ ...$attrs }">
        <slot></slot>
    </a>
</template>

<script setup lang="ts">
    const props = defineProps<{ source: string }>();
</script>
