<template>
    <div
        v-bind="{ ...$attrs }"
        :style="{
            width: props.direction === 'horizontal' ? props.size : 'fit-content',
            height: props.direction === 'vertical' ? props.size : 'fit-content',
        }"
        :class="['carousel-controls', `carousel-controls--${props.direction}`]"
        @mouseenter="mouseenterHandler"
        @mouseleave="mouseleaveHandler"
        @touchstart="mouseenterHandler"
        @touchend="mouseleaveHandler"
    >
        <button
            class="carousel-controls__button carousel-controls__button--prev"
            type="button"
            @click="scrollPrev"
            :disabled="!canScrollPrev"
        >
            <SvgSprite v-if="props.buttonIcon" :name="props.buttonIcon" :size="20" />
        </button>

        <div v-if="props.pagination === 'bullets'" class="carousel-controls__bullets">
            <button
                v-for="n in snapCount"
                :key="n"
                :class="[
                    'carousel-controls__bullets-item',
                    { 'carousel-controls__bullets-item--active': n === selectedSnap },
                ]"
                :inert="n === selectedSnap"
                @click="scrollTo(n - 1)"
            ></button>
        </div>

        <div v-else-if="props.pagination === 'num'" class="carousel-controls__pagination">
            <span class="carousel-controls__pagination-num">{{ selectedSnap }}</span>
            <span class="carousel-controls__pagination-separator">/</span>
            <span class="carousel-controls__pagination-num">{{ snapCount }}</span>
        </div>

        <button
            class="carousel-controls__button carousel-controls__button--next"
            type="button"
            @click="scrollNext"
            :disabled="!canScrollNext"
        >
            <SvgSprite v-if="props.buttonIcon" :name="props.buttonIcon" :size="20" />
        </button>
    </div>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            /**
             * Размер слайда
             *
             * @default 'fit-content'
             */
            size?: 'fit-content' | '100%' | 'auto';

            /**
             * Направление
             *
             * @default 'horizontal'
             */
            direction?: 'horizontal' | 'vertical';

            /**
             * Вариант пагинации
             *
             * - `none`:    отсуствие пагинации
             * - `num`:     числовая пагинация вида 5/12
             * - `bullets`: точечная пагинация
             *
             * @default 'none'
             */
            pagination?: 'none' | 'num' | 'bullets';

            /**
             * Инстанс слайдера для управления
             */
            for: ComputedRef<CarouselInstance | null>;

            /**
             * Ключ иконки из спрайта для кнопок
             *
             * @default ''
             */
            buttonIcon?: SpriteKey;
        }>(),
        {
            size: 'fit-content',
            pagination: 'none',
            direction: 'horizontal',
        }
    );

    const carouselApi = computed(() => props.for.value?.carouselApi);

    const selectedSnap = ref<number>(0);
    const snapCount = ref<number>(0);

    const canScrollPrev = ref(false);
    const canScrollNext = ref(false);

    function mouseenterHandler() {
        if (carouselApi.value?.plugins().autoplay) {
            carouselApi.value?.plugins().autoplay.stop();
        }
    }

    function mouseleaveHandler() {
        if (carouselApi.value?.plugins().autoplay) {
            carouselApi.value?.plugins().autoplay.play();
        }
    }

    const scrollPrev = () => {
        if (!carouselApi.value || !canScrollPrev.value) return;
        carouselApi.value.scrollPrev();
    };

    const scrollNext = () => {
        if (!carouselApi.value || !canScrollNext.value) return;
        carouselApi.value.scrollNext();
    };

    const scrollTo = (index: number) => {
        if (!carouselApi.value) return;
        carouselApi.value.scrollTo(index);
    };

    const updateSnapDisplay = () => {
        selectedSnap.value = (carouselApi.value?.selectedScrollSnap() ?? 0) + 1;
        snapCount.value = carouselApi.value?.scrollSnapList().length ?? 0;

        canScrollPrev.value = carouselApi.value?.canScrollPrev() || false;
        canScrollNext.value = carouselApi.value?.canScrollNext() || false;
    };

    onMounted(() => {
        carouselApi.value?.on('select', updateSnapDisplay).on('reInit', updateSnapDisplay);

        updateSnapDisplay();
    });
</script>

<style scoped lang="scss">
    .carousel-controls {
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

            transition: color $td $tf;
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
                scale: 0.9;
            }
            &--next {
                transform: scaleY(-1);
            }
        }
        &__bullets {
            display: flex;
            align-items: center;
            gap: rem(6);
            @at-root #{$p}--vertical & {
                flex-direction: column;
            }
            &-item {
                cursor: pointer;
                width: rem(8);
                min-width: rem(8);
                aspect-ratio: 1;
                border-radius: 50%;
                background-color: $c-secondary;
                opacity: 0.25;
                transition:
                    background-color $td $tf,
                    scale $td $tf,
                    opacity $td $tf;
                will-change: scale, opacity;
                @at-root #{$p}--vertical & {
                    width: rem(3);
                    min-width: rem(2);
                    height: rem(16);
                }
                &--active {
                    background-color: $c-accent;
                    scale: 1.2;
                    opacity: 1;
                    pointer-events: none;
                }
                @media (pointer: fine) {
                    &:hover {
                        background-color: $c-accent;
                        opacity: 1;
                        scale: 1.5;
                    }
                }
                &:focus-visible {
                    background-color: $c-accent;
                    opacity: 1;
                    scale: 1.5;
                }
                &:active {
                    scale: 1.2;
                }
            }
        }
        &__pagination {
            display: flex;
            align-items: center;
            gap: rem(4);
            font-size: rem(14);
            opacity: 0.75;
            user-select: none;
            @at-root #{$p}--vertical & {
                flex-direction: column;
                gap: rem(8);
            }
        }
    }
</style>
