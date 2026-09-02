<template>
    <component
        v-bind="{ ...$attrs }"
        :is="props.is"
        ref="carouselRef"
        :class="['carousel', props.class]"
        :style="{ overflow: props.overflow }"
        @mouseenter="mouseEnterHandler"
        @touchstart="mouseEnterHandler"
        @mouseleave="mouseLeaveHandler"
        @touchend="mouseLeaveHandler"
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
    </component>
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
            /**
             * Component HTML tag
             *
             * @default 'div'
             */
            is?: keyof HTMLElementTagNameMap;

            /**
             * Additional CSS class
             */
            class?: string | Record<string, unknown>;

            /**
             * Native Embla options
             *
             * @see https://www.embla-carousel.com/docs/v8/api/options
             */
            options?: EmblaOptionsType;

            /**
             * Внутренний отступ контейнера
             *
             * @default '0px'
             */
            padding?: string;

            /**
             * Режим переполнения
             *
             * @default 'hidden'
             */
            overflow?: 'hidden' | 'visible';

            /**
             * Направление карусели
             *
             * @default 'x'
             */
            axis?: 'x' | 'y';

            /**
             * Отступ между слайдами
             *
             * @default 0
             */
            spaceBetween?: number;

            /**
             * Embla Fade plugin
             *
             * @default false
             *
             * @see https://www.embla-carousel.com/docs/v8/plugins/fade
             */
            fade?: boolean;

            /**
             * Embla Autoplay plugin
             *
             * @default false
             *
             * @see https://www.embla-carousel.com/docs/v8/plugins/autoplay
             */
            autoplay?: boolean;

            /**
             * Embla Autoheight plugin
             *
             * @default false
             *
             * @see https://www.embla-carousel.com/docs/v8/plugins/auto-height
             */
            autoHeight?: boolean;

            /**
             * Embla Autoscroll plugin
             *
             * @default false
             *
             * @see https://www.embla-carousel.com/docs/v8/plugins/auto-scroll
             */
            autoScroll?: boolean;

            /**
             * Native Embla Autoscroll plugin options
             *
             * @see https://www.embla-carousel.com/docs/v8/plugins/auto-scroll
             */
            autoScrollOptions?: AutoScrollOptionsType;

            /**
             * Native Embla Autoplay plugin options
             *
             * @see https://www.embla-carousel.com/docs/v8/plugins/autoplay
             */
            autoplayOptions?: AutoplayOptionsType;

            /**
             * Остановка анимации Autoplay / Autocroll при ховере
             *
             * @default false
             */
            stopScrollOnHover?: boolean;
        }>(),
        {
            class: '',

            // state
            options: () => ({}),
            axis: 'x',
            spaceBetween: 0,
            padding: '0px',
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
