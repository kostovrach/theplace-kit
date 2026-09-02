<template>
    <component v-bind="{ ...$attrs }" :is="props.is" :class="['spoiler', props.class]">
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<SpoilerRootProps>(), {
        is: 'div',
        multiple: false,
        collapsible: true,
        disabled: false,
        animated: true,
        defaultValue: () => [],
        class: '',
    });

    const emit = defineEmits<SpoilerRootEmits>();

    // Controlled / uncontrolled via useVModel.
    // Initial value is identical on server and client → no hydration mismatch.
    const openValues = useVModel(props, 'modelValue', emit, {
        passive: true,
        defaultValue: props.defaultValue ?? [],
    });

    // Runtime guard (modelValue can be undefined initially)
    if (!Array.isArray(openValues.value)) {
        openValues.value = [];
    }

    const multiple = computed(() => props.multiple);
    const collapsible = computed(() => props.collapsible);
    const disabled = computed(() => props.disabled);
    const animated = computed(() => props.animated);

    // Stable ids map (populated by items with useId)
    const itemIds = ref(new Map<SpoilerValue, { triggerId: string; contentId: string }>());

    function getItemIds(value: SpoilerValue) {
        let ids = itemIds.value.get(value);
        if (!ids) {
            ids = {
                triggerId: `spoiler-trigger-${String(value)}`,
                contentId: `spoiler-content-${String(value)}`,
            };
            itemIds.value.set(value, ids);
        }
        return ids;
    }

    function registerItemIds(value: SpoilerValue, triggerId: string, contentId: string) {
        itemIds.value.set(value, { triggerId, contentId });
    }

    function isOpen(value: SpoilerValue): boolean {
        return openValues.value!.includes(value);
    }

    function isItemDisabled(_value: SpoilerValue): boolean {
        return disabled.value;
    }

    function toggle(value: SpoilerValue) {
        if (disabled.value) return;

        const currentlyOpen = isOpen(value);
        let next: SpoilerValue[];

        if (multiple.value) {
            next = currentlyOpen
                ? openValues.value!.filter((v) => v !== value)
                : [...openValues.value!, value];
        } else {
            // Single mode
            if (currentlyOpen) {
                next = collapsible.value ? [] : [...openValues.value!];
            } else {
                next = [value];
            }
        }

        openValues.value = next;
        emit('change', next);
    }

    const context: SpoilerContext = {
        openValues: openValues as Ref<SpoilerValue[]>,
        multiple,
        collapsible,
        disabled,
        animated,
        toggle,
        isOpen,
        isItemDisabled,
        getItemIds,
        registerItemIds,
    };

    provide(SpoilerContextKey, context);

    defineExpose({
        openValues,
        toggle,
        isOpen,
        open: (value: SpoilerValue) => {
            if (!isOpen(value)) toggle(value);
        },
        close: (value: SpoilerValue) => {
            if (isOpen(value)) toggle(value);
        },
        openAll: (values: SpoilerValue[]) => {
            if (multiple.value) {
                openValues.value = [...new Set([...openValues.value!, ...values])];
                emit('change', openValues.value);
            }
        },
        closeAll: () => {
            openValues.value = [];
            emit('change', []);
        },
    });
</script>
