<template>
    <component
        :is="componentTag"
        v-bind="{ ...attrs, ...$attrs }"
        :id="id || undefined"
        unstyled
        :class="['button-primary', props.class]"
    >
        <div class="button-primary__text">
            <slot></slot>
        </div>
        <span v-if="props.arrow" class="button-primary__icon">
            <SvgSprite type="common-arrow" :size="16" />
        </span>
    </component>
</template>

<script setup lang="ts">
    import { NuxtLink } from '#components';
    import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

    const props = withDefaults(
        defineProps<{
            is?: 'button' | 'a' | 'NuxtLink';
            to?: RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
            href?: string;
            buttonType?: string;
            target?: '' | '_blank' | '_self' | '_parent' | '_top';
            id?: string;
            arrow?: boolean;
            class?: string | Record<string, any>;
        }>(),
        {
            is: 'a',
            to: () => ({ name: 'index' }),
            href: '/',
            buttonType: 'button',
            target: '',
            id: '',
            arrow: false,
            class: '',
        }
    );

    const componentTag = computed(() => {
        switch (props.is) {
            case 'NuxtLink':
                return NuxtLink;
            case 'button':
                return 'button';
            default:
                return 'a';
        }
    });

    const attrs = computed(() => {
        switch (props.is) {
            case 'NuxtLink':
                return { to: props.to };
            case 'button':
                return { type: props.buttonType };
            case 'a':
                return {
                    href: props.href,
                    target: props.target || undefined,
                    rel: props.target === '_blank' ? 'noopener noreferrer' : undefined,
                };
            default:
                return {};
        }
    });
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .button-primary {
        $p: &;

        cursor: pointer;
        position: relative;
        white-space: nowrap;
        @media (pointer: fine) {
            &:hover {
            }
        }
        &:active {
        }
        &:focus-visible {
        }
        &__text {
        }
    }
</style>
