<template>
    <div ref="container">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    import type { Fancybox as FancyboxType, FancyboxOptions } from '@fancyapps/ui';

    const props = defineProps<{
        options?: FancyboxOptions;
    }>();

    const container = ref<HTMLElement | null>(null);

    const { $fancybox } = useNuxtApp();
    const Fancybox = $fancybox as typeof FancyboxType;

    function bind() {
        if (container.value) {
            Fancybox.bind(container.value, '[data-fancybox]', {
                mainStyle: {
                    '--f-toolbar-gap': '8px',
                    '--f-button-border-radius': '50%',
                    '--f-thumb-width': '96px',
                    '--f-thumb-height': '96px',
                },
                Carousel: {
                    Toolbar: {
                        display: {
                            right: ['close'],
                            left: [],
                        },
                    },
                    Thumbs: {
                        type: 'modern',
                    },
                },

                ...(props.options || {}),
            });
        }
    }

    onMounted(() => {
        bind();
    });

    watch(
        () => props.options,
        () => {
            Fancybox.unbind(container.value!);
            Fancybox.close();
            bind();
        }
    );

    onBeforeUnmount(() => {
        Fancybox.unbind(container.value!);
        Fancybox.close();
    });
</script>
