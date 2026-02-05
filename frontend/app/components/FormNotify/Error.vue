<template>
    <div :class="['form-notify-error', `form-notify-error--${props.alignment}`]">
        <span class="form-notify-error__icon">!</span>
        <span class="form-notify-error__text"><slot></slot></span>
    </div>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            alignment?: 'left' | 'center';
        }>(),
        {
            alignment: 'left',
        }
    );
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .form-notify-error {
        $error-color: red;

        width: 100%;
        max-width: rem(740);
        display: flex;
        align-items: flex-start;
        gap: rem(8);
        background-color: rgba($error-color, 0.7);
        border: rem(2) solid $error-color;
        border-radius: rem(8);
        padding: rem(8) rem(16);
        &--center {
            justify-content: center;
            max-width: initial;
        }
        &__icon {
            width: rem(18);
            min-width: rem(18);
            height: rem(18);
            min-height: rem(18);
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $c-FFFFFF;
            border-radius: 50%;
            color: $error-color;
            font-size: rem(14);
            font-weight: $fw-semi;
        }
        &__text {
            color: $c-FFFFFF;
            font-size: rem(13);
            line-height: 1.4;
        }
    }
</style>
