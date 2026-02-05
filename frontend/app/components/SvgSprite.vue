<template>
    <SvgIcon
        :name="props.type"
        :width="props.size"
        :height="props.size"
        :style="`color: ${props.color}`"
    />
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            type?: string;
            size?: number | string;
            color?: string;
        }>(),
        {
            type: 'arrow',
            size: 24,
            color: 'currentColor',
        }
    );
</script>
