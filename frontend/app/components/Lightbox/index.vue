<template>
    <component :is="props.is" ref="containerRef" v-bind="{ ...$attrs }">
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
    import type { Fancybox as FancyboxType, FancyboxOptions } from '@fancyapps/ui';

    const props = withDefaults(
        defineProps<{
            /** Component tag */
            is?: keyof HTMLElementTagNameMap;
            options?: FancyboxOptions;
        }>(),
        {
            is: 'div',
        }
    );

    const { $lightbox } = useNuxtApp();

    const containerRef = shallowRef<HTMLElement | null>(null);
    const lightbox = $lightbox as typeof FancyboxType;

    function bind() {
        if (containerRef.value) {
            lightbox.bind(containerRef.value, '[data-lightbox]', {
                mainStyle: {
                    '--f-toolbar-gap': '8px',
                    '--f-button-border-radius': '50%',
                    '--f-thumb-width': '96px',
                    '--f-thumb-height': '96px',
                },
                Carousel: {
                    Toolbar: { display: { right: ['close'], left: [] } },
                    Thumbs: { type: 'modern' },
                },
                ...(props.options || {}),
            });
        }
    }

    onMounted(() => bind());

    watch(
        () => props.options,
        () => {
            lightbox.unbind(containerRef.value!);
            lightbox.close();
            bind();
        }
    );

    onBeforeUnmount(() => {
        lightbox.unbind(containerRef.value!);
        lightbox.close();
    });
</script>
