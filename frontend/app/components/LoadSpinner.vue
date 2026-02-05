<template>
    <div class="load-spinner">
        <span></span>
    </div>
</template>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .load-spinner {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        > span {
            position: relative;
            display: block;
            width: rem(40);
            aspect-ratio: 1;
            &::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: {
                    top: rem(2) solid $c-accent;
                    right: rem(2) solid transparent;
                }
                animation: loader 1s linear infinite;
            }
        }
        @keyframes loader {
            to {
                rotate: 360deg;
            }
        }
    }
</style>
