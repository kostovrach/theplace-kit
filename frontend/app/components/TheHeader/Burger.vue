<template>
    <button class="burger">
        <span></span>
        <span></span>
        <span></span>
    </button>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .burger {
        $width: rem(24);
        $line-height: rem(2);
        $color: $c-FFFFFF;

        cursor: pointer;
        position: relative;
        width: $width;
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: rem(6);
        @media (pointer: fine) {
            &:hover {
                > span:nth-of-type(1),
                > span:nth-of-type(3) {
                    transform: scaleX(0.7);
                }
            }
        }
        > span:nth-of-type(2) {
            display: block;
            width: 100%;
            height: $line-height;
            background-color: $color;
            border-radius: rem(16);
        }
        > span:nth-of-type(1),
        > span:nth-of-type(3) {
            display: block;
            width: 100%;
            height: $line-height;
            border-radius: inherit;
            background-color: $color;
        }
        > span:nth-of-type(1) {
            will-change: transform;
            transition: transform $td $tf;
            transform-origin: left;
        }
        > span:nth-of-type(3) {
            will-change: transform;
            transition: transform $td $tf;
            transform-origin: right;
        }
    }
</style>
