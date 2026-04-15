<template>
    <svg class="liquid-glass-filter" width="0" height="0" aria-hidden="true">
        <defs>
            <filter
                id="liquid-glass-distortion"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
                color-interpolation-filters="sRGB"
            >
                <feTurbulence
                    type="turbulence"
                    baseFrequency="0.012 0.028"
                    numOctaves="0"
                    seed="2"
                    result="turbulence"
                    stdDeviation="5.5"
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="turbulence"
                    scale="20"
                    xChannelSelector="R"
                    yChannelSelector="B"
                />
            </filter>
        </defs>
    </svg>
</template>

<script setup lang="ts">
    const isSupported = ref(true);

    onMounted(() => (isSupported.value = isChromium()));
</script>

<style scoped lang="scss">
    .liquid-glass-filter {
        position: absolute;
        visibility: hidden;
    }
</style>
