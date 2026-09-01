<template>
    <svg
        class="icon"
        :width="props.size"
        :height="props.size"
        focusable="false"
        v-bind="{ ...$attrs }"
    >
        <use :href="`#${name}`" />
    </svg>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            name: SpriteKey;
            size?: number | string;
        }>(),
        { size: 24 }
    );
</script>
