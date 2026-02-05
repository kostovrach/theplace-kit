<template>
    <div class="slider-navigation">
        <button
            class="slider-navigation__button slider-navigation__button--prev"
            type="button"
            @click="scrollPrev"
            :disabled="!canScrollPrev"
        >
            <SvgSprite type="arrow" :size="20" />
        </button>
        <div class="slider-navigation__pagination">
            <span class="slider-navigation__pagination-current">{{ selectedSnap }}</span>
            <span class="slider-navigation__pagination-separator"></span>
            <span class="slider-navigation__pagination-total">{{ snapCount }}</span>
        </div>

        <button
            class="slider-navigation__button slider-navigation__button--next"
            type="button"
            @click="scrollNext"
            :disabled="!canScrollNext"
        >
            <SvgSprite type="arrow" :size="20" />
        </button>
    </div>
</template>

<script setup lang="ts">
    import type { EmblaCarouselType } from 'embla-carousel';

    const props = withDefaults(
        defineProps<{
            sliderRef: ComputedRef<{ emblaApi: EmblaCarouselType | null } | null> | null;
        }>(),
        {
            sliderRef: null,
        }
    );

    const emblaApi = computed(() => props.sliderRef?.value?.emblaApi);

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
        display: flex;
        align-items: center;
        gap: rem(32);
        color: $c-secondary;
        font-weight: $fw-semi;
        &__button {
            cursor: pointer;
            width: rem(56);
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;

            background-image: linear-gradient(to right, $c-accent 35%, $c-secondary 60%);
            background-size: 250%;
            background-repeat: no-repeat;
            background-position: 100%;
            transition:
                background-position $td $tf,
                color $td $tf,
                scale $td $tf;
            @media (pointer: fine) {
                &:hover {
                    color: $c-FFFFFF;
                    background-position: 0 0;
                }
            }
            &:disabled {
                pointer-events: none;
                opacity: 0.5;
            }
            &:active {
                color: $c-FFFFFF;
                background-image: linear-gradient(to top, $c-secondary);
                scale: 0.95;
            }
            &--prev {
                transform: scaleX(-1);
            }
        }
        &__pagination {
            display: flex;
            align-items: center;
            gap: rem(6);
            &-separator {
                width: rem(16);
                height: rem(2);
                background-color: currentColor;
            }
        }
    }
</style>
