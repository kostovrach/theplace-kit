<template>
    <component
        v-bind="{ ...$attrs }"
        :is="props.is"
        :id="item.contentId"
        role="region"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-animated="shouldAnimate ? '' : undefined"
        :aria-labelledby="item.triggerId"
        :aria-hidden="!isOpen"
        :class="[
            props.class,
            'spoiler-body',
            { 'spoiler-body--animated': shouldAnimate },
            { 'spoiler-body--open': isOpen },
            { 'spoiler-body--closed': !isOpen },
        ]"
    >
        <div class="spoiler-body__inner">
            <slot :open="isOpen"></slot>
        </div>
    </component>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            /**
             * Component HTML tag
             *
             * @default 'div'
             */
            is?: keyof HTMLElementTagNameMap;
            /**
             * Additional CSS class
             */
            class?: string | Record<string, unknown> | string[];
        }>(),
        {
            is: 'div',
            class: '',
        }
    );

    const item = inject(SpoilerItemContextKey);
    const root = inject(SpoilerContextKey);

    if (!item) {
        throw new Error('[SpoilerBody] must be used inside <SpoilerItem> component');
    }

    if (!root) {
        throw new Error('[SpoilerBody] must be used inside <Spoiler> component');
    }

    const preferredReducedMotion = usePreferredReducedMotion();

    const isOpen = computed(() => item.isOpen.value);
    const shouldAnimate = computed(() => {
        return root.animated.value && preferredReducedMotion.value !== 'reduce';
    });
</script>

<style scoped lang="scss">
    .spoiler-body {
        display: grid;
        grid-template-rows: 0fr;

        &--open {
            grid-template-rows: 1fr;
        }
        &--animated {
            transition: grid-template-rows $td $tf;
            /* Respect reduced motion even if class is present */
            @media (prefers-reduced-motion: reduce) {
                transition: none;
            }
        }
        &__inner {
            overflow: hidden;
            min-height: 0;
        }
    }
</style>
