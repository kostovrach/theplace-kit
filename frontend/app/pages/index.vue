<template>
    <Lightbox class="home">
        <Carousel ref="carouselRef" :space-between="32" class="test-carousel">
            <CarouselSlide v-for="n in 12" class="test-carousel__slide">
                <LightboxTrigger source="/favicon.svg" class="test-carousel__slide-body">
                    {{ n }}
                </LightboxTrigger>
            </CarouselSlide>
        </Carousel>
        <CarouselControls
            :for="computed(() => carouselRef)"
            direction="vertical"
            pagination="num"
        />
    </Lightbox>
</template>

<script setup lang="ts">
    const carouselRef = shallowRef<CarouselInstanceType | null>(null);
</script>

<style scoped lang="scss">
    .test-carousel {
        &__slide {
            max-width: rem(240);
            aspect-ratio: 1;
            background-color: blue;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: rem(24);
        }
    }
</style>
