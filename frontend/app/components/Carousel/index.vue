<template>
    <div
        ref="carouselRef"
        :class="['carousel', props.class]"
        :style="{ overflow: props.overflow }"
        @mouseenter="mouseEnterHandler"
        @touchstart="mouseEnterHandler"
        @mouseleave="mouseLeaveHandler"
        @touchend="mouseLeaveHandler"
        v-bind="{ ...$attrs }"
    >
        <div
            class="carousel__container"
            :style="{
                padding: props.padding,
                flexDirection: props.axis === 'x' ? 'row' : 'column',
                gap: `${props.spaceBetween}px`,
                height: props.axis === 'y' ? '100%' : 'fit-content',
                touchAction: props.axis === 'x' ? 'pan-y pinch-zoom' : 'pan-x pinch-zoom',
            }"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Embla from 'embla-carousel-vue';
    import Fade from 'embla-carousel-fade';
    import AutoHeight from 'embla-carousel-auto-height';
    import WheelGestures from 'embla-carousel-wheel-gestures';
    import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay';
    import AutoScroll, { type AutoScrollOptionsType } from 'embla-carousel-auto-scroll';

    import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';

    const props = withDefaults(
        defineProps<{
            class?: string | Record<string, unknown>;

            // state
            options?: EmblaOptionsType;
            padding?: string;
            overflow?: 'hidden' | 'visible';
            axis?: 'x' | 'y';
            spaceBetween?: number;

            // plugins
            fade?: boolean;
            autoplay?: boolean;
            autoHeight?: boolean;
            autoScroll?: boolean;

            // plugins options
            autoScrollOptions?: AutoScrollOptionsType;
            autoplayOptions?: AutoplayOptionsType;
            stopScrollOnHover?: boolean;
        }>(),
        {
            class: '',

            // state
            options: () => ({}),
            axis: 'x',
            spaceBetween: 0,
            padding: '0',
            overflow: 'hidden',

            // plugins
            fade: false,
            autoplay: false,
            autoHeight: false,
            autoScroll: false,

            // plugins options
            autoScrollOptions: () => ({}),
            autoplayOptions: () => ({}),
            stopScrollOnHover: false,
        }
    );

    const plugins: EmblaPluginType[] = [];
    const options: EmblaOptionsType = { axis: props.axis, ...props.options };

    const [carouselRef, carouselApi] = Embla(options, plugins);

    function setPlugins() {
        plugins.push(WheelGestures());

        if (props.autoplay) {
            plugins.push(Autoplay({ ...props.autoplayOptions }));
        }

        if (props.fade) {
            plugins.push(Fade());
        }

        if (props.autoHeight) {
            plugins.push(AutoHeight());
        }

        if (props.autoScroll) {
            plugins.push(AutoScroll({ ...props.autoScrollOptions }));
        }
    }

    function mouseEnterHandler() {
        if (props.autoScroll && props.stopScrollOnHover) {
            carouselApi.value?.plugins().autoScroll.stop();
        }
        if (props.autoplay && props.stopScrollOnHover) {
            carouselApi.value?.plugins().autoplay.stop();
        }
    }
    function mouseLeaveHandler() {
        if (props.autoScroll && props.stopScrollOnHover) {
            carouselApi.value?.plugins().autoScroll.play();
        }
        if (props.autoplay && props.stopScrollOnHover) {
            carouselApi.value?.plugins().autoplay.play();
        }
    }

    setPlugins();

    defineExpose({ carouselApi, carouselRef });
</script>

<style scoped lang="scss">
    .carousel {
        user-select: none;
        width: 100%;
        &__container {
            display: flex;
        }
    }
</style>
