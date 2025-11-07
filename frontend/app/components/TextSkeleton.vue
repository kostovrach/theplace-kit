<template>
    <div class="text-skeleton">
        <div v-for="n in 7" :key="n" class="text-skeleton__item">
            <div class="text-skeleton__skeleton text-skeleton__skeleton--title"></div>
            <div class="text-skeleton__item-text">
                <div
                    v-for="n2 in 4"
                    :key="n2"
                    class="text-skeleton__skeleton text-skeleton__skeleton--text"
                ></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .text-skeleton {
        display: flex;
        flex-direction: column;
        gap: rem(32);
        &__item {
            &-text {
                display: flex;
                flex-direction: column;
                gap: rem(8);
                margin-top: rem(12);
            }
        }
        &__skeleton {
            opacity: 0.5;
            @include skeleton();
            &--title {
                width: 30%;
                height: 1.2rem;
            }
            &--text {
                width: 100%;
                height: 0.8rem;
            }
        }
    }
</style>
