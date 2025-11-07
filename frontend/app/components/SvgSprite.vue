<template>
    <SvgIcon :name="type" :width="size" :height="size" :style="`color: ${color}`" />
</template>

<script setup lang="ts">
    defineProps({
        type: { type: String, required: true },
        size: { type: [Number, String], default: 24 },
        color: { type: String, default: 'currentColor' },
    });
</script>
