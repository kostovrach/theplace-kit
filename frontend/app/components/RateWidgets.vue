<template>
    <ul class="rate-widgets">
        <li class="rate-widgets__item">
            <div class="rate-widgets__item-wrapper">
                <h3 class="rate-widgets__item-title">Яндекс карты</h3>
                <a
                    class="rate-widgets__item-counter"
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    71 отзыв
                </a>
                <picture class="rate-widgets__item-image-container">
                    <img class="rate-widgets__item-image" src="/img/company/yandex.svg" alt="#" />
                </picture>
                <div class="rate-widgets__item-rate">
                    <span>5.0</span>
                    <SvgSprite type="star" :size="16" />
                </div>
            </div>
        </li>
        <li class="rate-widgets__item">
            <div class="rate-widgets__item-wrapper">
                <h3 class="rate-widgets__item-title">2GIS</h3>
                <a
                    class="rate-widgets__item-counter"
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    71 отзыв
                </a>
                <picture class="rate-widgets__item-image-container">
                    <img class="rate-widgets__item-image" src="/img/company/2gis.svg" alt="#" />
                </picture>
                <div class="rate-widgets__item-rate">
                    <span>5.0</span>
                    <SvgSprite type="star" :size="16" />
                </div>
            </div>
        </li>
        <li class="rate-widgets__item">
            <div class="rate-widgets__item-wrapper">
                <h3 class="rate-widgets__item-title">Google Карты</h3>
                <a
                    class="rate-widgets__item-counter"
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    71 отзыв
                </a>
                <picture class="rate-widgets__item-image-container">
                    <img class="rate-widgets__item-image" src="/img/company/google.svg" alt="#" />
                </picture>
                <div class="rate-widgets__item-rate">
                    <span>5.0</span>
                    <SvgSprite type="star" :size="16" />
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .rate-widgets {
        display: flex;
        flex-wrap: wrap;
        gap: rem(16) rem(32);
        &__item {
            width: 100%;
            flex: 0 1 rem(300);
            @media (max-width: 768px) {
                flex-grow: 1;
            }
            // background-color: rgba($c-D4E1E7, 0.5); // <----- 
            border-radius: rem(32) rem(32) 0 rem(32);
            &-wrapper {
                display: grid;
                grid-template-columns: repeat(2, auto);
                grid-template-rows: repeat(2, auto);
                grid-template-areas:
                    'title counter'
                    'image rate';
                justify-content: space-between;
                align-items: center;
                gap: rem(22) rem(32);
                padding: rem(18) rem(24);
            }
            &-title {
                grid-area: title;
                // font-weight: $fw-semi; // <----- 
            }
            &-counter {
                grid-area: counter;
                font-size: rem(14);
                border-bottom: rem(1) dotted currentColor;
                opacity: 0.5;
                @media (pointer: fine) {
                    &:hover {
                        border-color: transparent;
                    }
                }
            }
            &-image-container {
                grid-area: image;
                max-width: rem(100);
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
            &-rate {
                grid-area: rate;
                justify-self: flex-end;
                width: fit-content;
                display: flex;
                align-items: center;
                gap: rem(4);
            }
        }
    }
</style>
