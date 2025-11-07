<template>
    <div ref="emblaRef" class="embla" :style="{ overflow: props.overflow }">
        <div
            class="embla__container"
            :style="{
                padding: props.padding,
                flexDirection: props.axis === 'x' ? 'row' : 'column',
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
    import type { AutoplayOptionsType } from 'embla-carousel-autoplay';
    import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';

    const props = withDefaults(defineProps<{
        options?: EmblaOptionsType;
        fade?: boolean;
        padding?: string;
        autoplayEnable?: boolean;
        autoplay?: AutoplayOptionsType;
        overflow?: 'hidden' | 'visible';
        axis?: 'x' | 'y';
    }>(), {
        options: () => ({}),
        autoplay: () => ({}),
        fade: false,
        padding: '0',
        autoplayEnable: false,
        overflow: 'hidden',
        axis: 'x',
    });

    const plugins: EmblaPluginType[] = [];

    if (props.autoplayEnable && props.autoplay) {
        plugins.push(
            Autoplay({
                ...props.autoplay,
            })
        );
    }

    if (props.fade) {
        plugins.push(Fade());
    }

    const [emblaRef, emblaApi] = emblaCarouselVue(props.options, plugins);

    defineExpose({
        emblaApi,
    });
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .embla {
        user-select: none;
        &__container {
            display: flex;
            align-items: center;
        }
    }
</style>
