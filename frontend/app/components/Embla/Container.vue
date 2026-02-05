<template>
    <div
        ref="emblaRef"
        class="embla"
        :style="{ overflow: props.overflow }"
        @mouseenter="mouseEnterHandler"
        @mouseleave="mouseLeaveHandler"
    >
        <div
            class="embla__container"
            :style="{
                padding: props.padding,
                flexDirection: props.axis === 'x' ? 'row' : 'column',
                gap: `${props.spaceBetween}px`,
                height: props.axis === 'y' ? '100%' : 'fit-content',
            }"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import emblaCarouselVue from 'embla-carousel-vue';
    import Autoplay from 'embla-carousel-autoplay';
    import Fade from 'embla-carousel-fade';
    import AutoHeight from 'embla-carousel-auto-height';
    import AutoScroll, { type AutoScrollOptionsType } from 'embla-carousel-auto-scroll';
    import type { AutoplayOptionsType } from 'embla-carousel-autoplay';
    import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';

    const props = withDefaults(
        defineProps<{
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

    // State =====================================================
    const plugins: EmblaPluginType[] = [];
    const options: EmblaOptionsType = {
        axis: props.axis,
        ...props.options,
    };

    const [emblaRef, emblaApi] = emblaCarouselVue(options, plugins);
    // ===========================================================

    // Methods ===================================================
    function setPlugins() {
        if (props.autoplay) {
            plugins.push(
                Autoplay({
                    ...props.autoplayOptions,
                })
            );
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
            emblaApi.value?.plugins().autoScroll.stop();
        }
    }
    function mouseLeaveHandler() {
        if (props.autoScroll && props.stopScrollOnHover) {
            emblaApi.value?.plugins().autoScroll.play();
        }
    }
    // ===========================================================

    setPlugins();

    defineExpose({
        emblaApi,
        emblaRef,
    });
</script>

<style scoped lang="scss">
    .embla {
        user-select: none;
        max-width: 100%;
        &__container {
            display: flex;
        }
    }
</style>
