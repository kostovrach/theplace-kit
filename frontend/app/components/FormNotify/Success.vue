<template>
    <div :class="['modal-notify-success', `modal-notify-success--${props.theme}`]">
        <span class="modal-notify-success__icon">i</span>
        <span class="modal-notify-success__text"><slot></slot></span>
    </div>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            theme?: 'dark' | 'light';
        }>(),
        {
            theme: 'dark',
        }
    );
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .modal-notify-success {
        $color: green;

        display: flex;
        align-items: flex-start;
        gap: rem(16);
        padding: rem(8) rem(16);
        background-color: rgba($color, 0.75);
        border: rem(2) solid $color;
        border-radius: rem(8);
        &__icon {
            width: rem(20);
            min-width: rem(20);
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $c-FFFFFF;
            border-radius: 50%;
            color: $color;
        }
        &__text {
            color: $c-FFFFFF;
            line-height: 1.4;
        }
    }
</style>
