<template>
    <div
        :class="['slider-navigation', `slider-navigation--${props.direction}`]"
        :style="{
            width: props.direction === 'horizontal' ? props.size : 'fit-content',
            height: props.direction === 'vertical' ? props.size : 'fit-content',
        }"
        @mouseenter="mouseenterHandler"
        @mouseleave="mouseleaveHandler"
        @touchstart="mouseenterHandler"
        @touchend="mouseleaveHandler"
    >
        <button
            class="slider-navigation__button slider-navigation__button--prev"
            type="button"
            @click="scrollPrev"
            :disabled="!canScrollPrev"
        >
            <SvgSprite type="common-chevron" :size="20" />
        </button>

        <div v-if="props.pagination" class="slider-navigation__pagination">
            <span
                v-for="n in snapCount"
                :key="n"
                :class="[
                    'slider-navigation__pagination-bullet',
                    { 'slider-navigation__pagination-bullet--active': n === selectedSnap },
                ]"
            ></span>
        </div>

        <button
            class="slider-navigation__button slider-navigation__button--next"
            type="button"
            @click="scrollNext"
            :disabled="!canScrollNext"
        >
            <SvgSprite type="common-chevron" :size="20" />
        </button>
    </div>
</template>

<script setup lang="ts">
    import type { EmblaCarouselType } from 'embla-carousel';

    const props = withDefaults(
        defineProps<{
            size?: 'fit-content' | '100%' | 'auto';
            direction?: 'horizontal' | 'vertical';
            pagination?: boolean;
            sliderRef: ComputedRef<{ emblaApi: EmblaCarouselType | null } | null> | null;
        }>(),
        {
            size: 'fit-content',
            sliderRef: null,
            pagination: false,
            direction: 'horizontal',
        }
    );

    const emblaApi = computed(() => props.sliderRef?.value?.emblaApi);

    function mouseenterHandler() {
        if (emblaApi.value?.plugins().autoplay) {
            emblaApi.value?.plugins().autoplay.stop();
        }
    }

    function mouseleaveHandler() {
        if (emblaApi.value?.plugins().autoplay) {
            emblaApi.value?.plugins().autoplay.play();
        }
    }

    // controls =======================================================
    const scrollPrev = () => {
        if (!emblaApi.value || !canScrollPrev.value) return;
        emblaApi.value.scrollPrev();
    };
    const scrollNext = () => {
        if (!emblaApi.value || !canScrollNext.value) return;
        emblaApi.value.scrollNext();
    };
    // ================================================================

    // pagination =====================================================
    const selectedSnap = ref<number>(0);
    const snapCount = ref<number>(0);

    const canScrollPrev = ref(false);
    const canScrollNext = ref(false);

    const updateSnapDisplay = () => {
        selectedSnap.value = (emblaApi.value?.selectedScrollSnap() ?? 0) + 1;
        snapCount.value = emblaApi.value?.scrollSnapList().length ?? 0;

        canScrollPrev.value = emblaApi.value?.canScrollPrev() || false;
        canScrollNext.value = emblaApi.value?.canScrollNext() || false;
    };

    onMounted(() => {
        emblaApi.value?.on('select', updateSnapDisplay).on('reInit', updateSnapDisplay);

        updateSnapDisplay();
    });
    // ================================================================
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .slider-navigation {
        $p: &;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: rem(32);
        font-weight: $fw-semi;
        &--vertical {
            flex-direction: column;
        }
        &__button {
            cursor: pointer;
            width: rem(56);
            color: currentColor;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            rotate: 90deg;

            transition:
                background-position $td $tf,
                color $td $tf,
                scale $td $tf;
            @media (pointer: fine) {
                &:hover {
                    color: $c-accent;
                }
            }
            &:focus-visible {
                color: $c-accent;
            }
            @at-root #{$p}--vertical & {
                rotate: 180deg;
            }
            &:disabled {
                pointer-events: none;
                opacity: 0.5;
            }
            &:active {
                scale: 0.8;
            }
            &--next {
                transform: scaleY(-1);
            }
        }
        &__pagination {
            display: flex;
            align-items: center;
            gap: rem(6);
            @at-root #{$p}--vertical & {
                flex-direction: column;
            }
            &-bullet {
                width: rem(16);
                min-width: rem(16);
                height: rem(3);
                border-radius: rem(8);
                background-color: $c-secondary;
                opacity: 0.25;
                transition:
                    scale $td $tf,
                    opacity $td $tf;
                will-change: scale, opacity;
                @at-root #{$p}--vertical & {
                    width: rem(3);
                    min-width: rem(2);
                    height: rem(16);
                }
                &--active {
                    background-color: $c-secondary;
                    scale: 1.2;
                    opacity: 1;
                }
            }
        }
    }
</style>
