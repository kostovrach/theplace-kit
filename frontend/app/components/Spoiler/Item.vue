<template>
    <component
        v-bind="{ ...$attrs }"
        :is="props.is"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-disabled="isDisabled ? '' : undefined"
        :class="['spoiler-item', props.class]"
    >
        <slot :open="isOpen" :disabled="isDisabled" :toggle="toggle"></slot>
    </component>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<SpoilerItemProps>(), {
        is: 'div',
        disabled: false,
        class: '',
    });

    const context = inject(SpoilerContextKey);

    if (!context) {
        throw new Error('[SpoilerItem] must be used inside <Spoiler> component');
    }

    const triggerId = useId();
    const contentId = useId();

    context.registerItemIds(props.value, triggerId, contentId);

    const isOpen = computed(() => context.isOpen(props.value));
    const isDisabled = computed(() => props.disabled || context.disabled.value);

    function toggle() {
        if (!isDisabled.value) {
            context!.toggle(props.value);
        }
    }

    const itemContext = { value: props.value, isOpen, isDisabled, triggerId, contentId, toggle };

    provide(SpoilerItemContextKey, itemContext);
</script>
