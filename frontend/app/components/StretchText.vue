<template>
    <svg
        class="stretch-text"
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        xmlns="http://www.w3.org/2000/svg"
    >
        <text
            ref="textRef"
            text-anchor="start"
            x="0"
            y="50%"
            class="stretch-text__value"
            dominant-baseline="central"
            fill="currentColor"
        >
            {{ props.value }}
        </text>
    </svg>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            value: string;
        }>(),
        {
            value: '',
        }
    );

    const FILL_RATIO = 1;

    const textRef = ref<SVGTextElement | null>(null);

    const viewBoxWidth = ref(100);
    const viewBoxHeight = ref(20);

    function doStretch() {
        if (!textRef.value) return;

        const text = textRef.value;

        const textWidth = text.getBBox().width;
        const textHeight = text.getBBox().height;

        viewBoxWidth.value = Math.round(textWidth / FILL_RATIO);
        viewBoxHeight.value = Math.round(textHeight * 0.8);
    }

    onMounted(() => {
        doStretch();
        window.addEventListener('resize', doStretch);
    });

    onUnmounted(() => window.removeEventListener('resize', doStretch));
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .stretch-text {
        width: 100%;
        height: auto;
        display: block;
        &__value {
            text-transform: inherit;
            line-height: inherit;
            font-family: inherit;
            font-weight: inherit;
        }
    }
</style>
