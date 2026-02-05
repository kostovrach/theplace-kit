<template>
    <div class="form-notify-info" :style="{ top: props.position.top, left: props.position.left }">
        <span class="form-notify-info__icon">i</span>
        <span class="form-notify-info__text"><slot></slot></span>
    </div>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            position: { top: string; left: string };
        }>(),
        {
            position: () => ({ top: '100%', left: '0%' }),
        }
    );
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .form-notify-info {
        $p: &;

        position: absolute;
        z-index: 5;
        display: flex;
        align-items: center;
        gap: rem(8);
        padding: rem(8) rem(16);
        border-radius: rem(8);
        pointer-events: none;
        color: $c-FFFFFF;
        border: rem(2) solid $c-accent;
        background-color: rgba($c-accent, 0.5);
        backdrop-filter: blur(5px);
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 10%;
            width: rem(12);
            aspect-ratio: 1;
            background-color: inherit;
            translate: 0 -50%;
            rotate: 45deg;
            clip-path: polygon(0 0, 100% 0, 0 100%);
        }
        &__icon {
            width: rem(20);
            min-width: rem(20);
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: $c-FFFFFF;
            font-size: rem(16);
            background-color: $c-accent;
        }
        &__text {
            font-size: rem(14);
        }
    }
</style>
