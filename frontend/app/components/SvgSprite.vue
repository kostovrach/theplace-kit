<template>
    <svg
        v-bind="{ ...$attrs }"
        :class="['icon', props.class]"
        :width="props.size"
        :height="props.size"
        :aria-hidden="props.decorative ? 'true' : undefined"
        :role="props.decorative ? undefined : 'img'"
        focusable="false"
    >
        <use :href="`#${name}`" />
    </svg>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            /**
             * Icon name from the SVG sprite.
             */
            name: SpriteKey;

            /**
             * Icon size.
             *
             * @default 24
             */
            size?: number | string;

            /**
             * Additional CSS class.
             */
            class?: string | Record<string, unknown> | string[];

            /**
             * Whether the icon is decorative and should be hidden from assistive technologies.
             *
             * @default true
             */
            decorative?: boolean;
        }>(),
        { size: 24, class: '', decorative: true }
    );
</script>
